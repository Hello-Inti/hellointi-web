/**
 * Reusable Popup Framework
 * Supports multiple popup types with GDPR compliance, analytics, and accessibility
 *
 * ------------------------------------------------------------
 * QUICK START (Lead Magnet / Google Form -> PDF download)
 * ------------------------------------------------------------
 * 1) Include the framework assets on your landing page:
 *    <link rel="stylesheet" href="../popup-framework.css">
 *    <script src="../popup-framework.js"></script>
 *
 * 2) Add a trigger element (button/link) with these attributes:
 *    data-popup="lead-magnet-popup"
 *    data-popup-type="lead-magnet"
 *    data-form-src="https://docs.google.com/forms/.../viewform?embedded=true"
 *    data-download-url="./Your%20PDF.pdf" (or full https URL)
 *    Optional:
 *      data-popup-title="..."
 *      data-popup-description="..."
 *
 * 3) Add the popup markup once per page (IDs must match):
 *    <div id="lead-magnet-popup" class="popup-framework" aria-hidden="true" role="dialog" aria-modal="true">
 *      <div class="popup-framework-overlay"></div>
 *      <div class="popup-framework-content">
 *        <button class="popup-framework-close" type="button" aria-label="Close dialog">×</button>
 *        <div class="popup-header">
 *          <h2 data-popup-title>...</h2>
 *          <p data-popup-description>...</p>
 *        </div>
 *        <div class="popup-body">
 *          <iframe data-lead-magnet-iframe class="lead-magnet-iframe" title="Lead form" src="about:blank"></iframe>
 *          <a data-download-link class="btn-secondary" href="./Your%20PDF.pdf" target="_blank" rel="noopener">Open the PDF</a>
 *        </div>
 *      </div>
 *    </div>
 *
 * Behavior:
 * - The iframe loads the Google Form on open.
 * - After the user submits, Google navigates the iframe; we detect this and attempt to auto-download.
 * - A thank-you view is shown with a manual download link as a fallback.
 */

class PopupFramework {
    constructor(options = {}) {
        this.options = {
            animationDuration: 0.3,
            enableAnalytics: options.enableAnalytics || false,
            analyticsCallback: options.analyticsCallback || null,
            gdprCompliance: options.gdprCompliance || true,
            storageKey: 'popup_preferences',
            ...options
        };

        this.activePopups = new Map();
        this.focusTrapHandlers = new Map();
        this.triggerElements = new Map();

        this.init();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find all popup triggers and initialize them
        this.initializePopupTriggers();

        // Setup global event listeners
        this.setupGlobalEventListeners();

        // Load user preferences if GDPR is enabled
        if (this.options.gdprCompliance) {
            this.loadUserPreferences();
        }
    }

    /**
     * Type initializers
     * These are lightweight “conventions” so pages can configure popups via data-attributes.
     */
    initializePopupType(popupId, popupEl, popupConfig) {
        if (popupConfig.type === 'lead-magnet') {
            this.initLeadMagnetPopup(popupId, popupEl);
        }
    }

    /**
     * Register a new popup type
     */
    registerPopup(popupId, config) {
        const popup = document.getElementById(popupId);
        if (!popup) {
            console.warn(`Popup with ID "${popupId}" not found`);
            return false;
        }

        const popupConfig = {
            type: config.type || 'default',
            triggerSelector: config.triggerSelector || `.${popupId}-trigger`,
            content: config.content || null,
            onOpen: config.onOpen || null,
            onClose: config.onClose || null,
            onBeforeOpen: config.onBeforeOpen || null,
            onBeforeClose: config.onBeforeClose || null,
            analyticsEvent: config.analyticsEvent || null,
            requireConsent: config.requireConsent || false,
            showOnce: config.showOnce || false,
            delay: config.delay || 0,
            ...config
        };

        this.activePopups.set(popupId, {
            element: popup,
            config: popupConfig,
            isOpen: false,
            triggerElement: null
        });

        // Add popup type class
        popup.classList.add(popupConfig.type);

        // Initialize type-specific behavior
        this.initializePopupType(popupId, popup, popupConfig);

        // Setup triggers for this popup
        this.setupPopupTriggers(popupId, popupConfig);

        return true;
    }

    /**
     * Lead Magnet popup behavior:
     * - Presents an embedded Google Form in an iframe.
     * - After the user submits, Google navigates the iframe to a confirmation screen.
     * - We detect the post-submit navigation via the iframe `load` event count (cross-origin safe).
     * - Then we attempt to auto-trigger download of a specified PDF URL and show a thank-you view
     *   with a manual download link as fallback.
     */
    initLeadMagnetPopup(popupId, popup) {
        // Only initialize once.
        if (popup.dataset.leadMagnetInitialized === 'true') return;
        popup.dataset.leadMagnetInitialized = 'true';

        const getConfigFromTrigger = (trigger) => {
            const downloadUrl = trigger?.getAttribute('data-download-url') || popup.getAttribute('data-download-url');
            const formSrc = trigger?.getAttribute('data-form-src') || popup.getAttribute('data-form-src');
            const title = trigger?.getAttribute('data-popup-title') || popup.getAttribute('data-popup-title');
            const description = trigger?.getAttribute('data-popup-description') || popup.getAttribute('data-popup-description');
            return { downloadUrl, formSrc, title, description };
        };

        const popupData = this.activePopups.get(popupId);
        if (!popupData) return;

        const originalOnOpen = popupData.config.onOpen;
        const originalOnClose = popupData.config.onClose;

        popupData.config.onOpen = (el, trigger) => {
            const cfg = getConfigFromTrigger(trigger);
            this.renderLeadMagnetForm(el, cfg);
            this.bindLeadMagnetFormDetection(el, cfg);
            if (originalOnOpen) originalOnOpen(el, trigger);
        };

        popupData.config.onClose = (el) => {
            this.resetLeadMagnetState(el);
            if (originalOnClose) originalOnClose(el);
        };
    }

    renderLeadMagnetForm(popup, cfg) {
        const title = cfg.title || 'Get the free playbook';
        const description = cfg.description || 'Enter your details and we’ll start your download automatically after you submit.';
        const formSrc = cfg.formSrc || '';

        const headerTitle = popup.querySelector('[data-popup-title]');
        const headerDesc = popup.querySelector('[data-popup-description]');
        const iframe = popup.querySelector('iframe[data-lead-magnet-iframe]');

        if (headerTitle) headerTitle.textContent = title;
        if (headerDesc) headerDesc.textContent = description;

        if (iframe && formSrc) {
            // Assign src only on open to avoid loading in background.
            iframe.src = formSrc;
        }

        popup.classList.remove('success');
        popup.dataset.leadMagnetCompleted = 'false';
        popup.dataset.leadMagnetOpenTs = String(Date.now());
        popup.dataset.leadMagnetLoadCount = '0';

        // Update fallback link if present
        const fallbackLink = popup.querySelector('a[data-download-link]');
        if (fallbackLink && cfg.downloadUrl) {
            fallbackLink.href = cfg.downloadUrl;
        }
    }

    bindLeadMagnetFormDetection(popup, cfg) {
        const iframe = popup.querySelector('iframe[data-lead-magnet-iframe]');
        if (!iframe) return;

        // Avoid stacking listeners across opens.
        if (popup._leadMagnetIframeLoadHandler) {
            iframe.removeEventListener('load', popup._leadMagnetIframeLoadHandler);
        }

        const handler = () => {
            const currentCount = Number(popup.dataset.leadMagnetLoadCount || '0') + 1;
            popup.dataset.leadMagnetLoadCount = String(currentCount);

            // Heuristic:
            // - count 1: initial render of embedded form
            // - count 2+: navigation after submit to Google “Thanks” screen
            const openedAt = Number(popup.dataset.leadMagnetOpenTs || '0');
            const elapsed = Date.now() - openedAt;
            const alreadyCompleted = popup.dataset.leadMagnetCompleted === 'true';

            if (!alreadyCompleted && currentCount >= 2 && elapsed > 1500) {
                popup.dataset.leadMagnetCompleted = 'true';
                this.triggerLeadMagnetDownload(cfg.downloadUrl);
                this.renderLeadMagnetSuccess(popup, cfg.downloadUrl);
            }
        };

        popup._leadMagnetIframeLoadHandler = handler;
        iframe.addEventListener('load', handler);
    }

    resetLeadMagnetState(popup) {
        // Stop iframe from continuing to load/track in background
        const iframe = popup.querySelector('iframe[data-lead-magnet-iframe]');
        if (iframe) {
            iframe.src = 'about:blank';
        }

        popup.dataset.leadMagnetCompleted = 'false';
        popup.dataset.leadMagnetLoadCount = '0';
    }

    triggerLeadMagnetDownload(downloadUrl) {
        if (!downloadUrl) return;
        try {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = '';
            a.rel = 'noopener';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.warn('Auto-download failed:', e);
        }
    }

    renderLeadMagnetSuccess(popup, downloadUrl) {
        const body = popup.querySelector('.popup-body');
        if (!body) return;

        const safeUrl = downloadUrl || '#';
        const isWaitlist = popup.id === 'waitlist-popup';

        const successMessage = isWaitlist
            ? "Thank you! Mitra or San will contact you as soon as a spot opens for the pilot program. Meanwhile, download the playbook."
            : "Thanks for your curiosity and willingness to play. Mitra or San will reach out to you soon.";

        body.innerHTML = `
            <div class="popup-success" role="status" aria-live="polite">
                <div class="success-icon" aria-hidden="true">✓</div>
                <h3>${successMessage}</h3>
                <div class="lead-magnet-actions">
                    <a class="btn-primary" data-download-link href="${safeUrl}" download="The Long Game Events Playbook.pdf" target="_blank" rel="noopener">Download the Playbook</a>
                    <button class="btn-secondary" type="button" data-close-popup>Close</button>
                </div>
            </div>
        `;

        popup.classList.add('success');

        const closeBtn = popup.querySelector('[data-close-popup]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                for (const [id, data] of this.activePopups) {
                    if (data.element === popup) {
                        this.closePopup(id);
                        break;
                    }
                }
            }, { once: true });
        }
    }

    /**
     * Setup triggers for a specific popup
     */
    setupPopupTriggers(popupId, config) {
        const triggers = document.querySelectorAll(config.triggerSelector);

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPopup(popupId, trigger);
            });
        });
    }

    /**
     * Initialize all popup triggers found in the DOM
     */
    initializePopupTriggers() {
        // Find all elements with data-popup attribute
        const triggers = document.querySelectorAll('[data-popup]');

        triggers.forEach(trigger => {
            const popupId = trigger.getAttribute('data-popup');
            const popupType = trigger.getAttribute('data-popup-type') || 'default';

            if (!this.activePopups.has(popupId)) {
                this.registerPopup(popupId, {
                    type: popupType,
                    triggerSelector: `[data-popup="${popupId}"]`
                });
            }
        });
    }

    /**
     * Open a popup
     */
    async openPopup(popupId, triggerElement = null) {
        const popupData = this.activePopups.get(popupId);
        if (!popupData) {
            console.error(`Popup "${popupId}" not found`);
            return false;
        }

        const { element: popup, config } = popupData;

        // Check if popup should only be shown once
        if (config.showOnce && this.hasBeenShown(popupId)) {
            console.log(`Popup "${popupId}" has already been shown`);
            return false;
        }

        // Check consent requirements
        if (config.requireConsent && !this.hasConsent(config.requireConsent)) {
            console.log(`Popup "${popupId}" requires consent that was not given`);
            return false;
        }

        // Execute before open callback
        if (config.onBeforeOpen) {
            const result = await config.onBeforeOpen(popup, triggerElement);
            if (result === false) {
                return false;
            }
        }

        // Store trigger element for focus restoration
        if (triggerElement) {
            this.triggerElements.set(popupId, triggerElement);
        }

        // Add delay if specified
        if (config.delay > 0) {
            await this.delay(config.delay);
        }

        // Show popup with animation
        this.showPopup(popup, popupId);

        // Execute after open callback
        if (config.onOpen) {
            config.onOpen(popup, triggerElement);
        }

        // Track analytics
        if (this.options.enableAnalytics && config.analyticsEvent) {
            this.trackEvent(config.analyticsEvent, 'open', popupId);
        }

        // Mark as shown
        if (config.showOnce) {
            this.markAsShown(popupId);
        }

        popupData.isOpen = true;
        return true;
    }

    /**
     * Close a popup
     */
    async closePopup(popupId) {
        const popupData = this.activePopups.get(popupId);
        if (!popupData || !popupData.isOpen) {
            return false;
        }

        const { element: popup, config } = popupData;

        // Execute before close callback
        if (config.onBeforeClose) {
            const result = await config.onBeforeClose(popup);
            if (result === false) {
                return false;
            }
        }

        // Hide popup with animation
        this.hidePopup(popup, popupId);

        // Execute after close callback
        if (config.onClose) {
            config.onClose(popup);
        }

        // Track analytics
        if (this.options.enableAnalytics && config.analyticsEvent) {
            this.trackEvent(config.analyticsEvent, 'close', popupId);
        }

        popupData.isOpen = false;
        return true;
    }

    /**
     * Show popup with animation
     */
    showPopup(popup, popupId) {
        // Add loading state if needed
        if (popup.classList.contains('loading')) {
            // Loading state will be handled by content loading
        }

        // Set aria attributes
        popup.setAttribute('aria-hidden', 'false');
        popup.classList.add('is-visible');

        // Animate with GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            gsap.to(popup, {
                duration: this.options.animationDuration,
                autoAlpha: 1,
                display: 'block',
                ease: 'power2.out',
                onComplete: () => {
                    this.setupFocusTrap(popupId);
                    this.focusFirstElement(popup);
                }
            });
        } else {
            // Fallback to CSS transitions
            popup.style.display = 'block';
            popup.style.opacity = '1';

            setTimeout(() => {
                this.setupFocusTrap(popupId);
                this.focusFirstElement(popup);
            }, this.options.animationDuration * 1000);
        }
    }

    /**
     * Hide popup with animation
     */
    hidePopup(popup, popupId) {
        // Remove focus trap
        this.removeFocusTrap(popupId);

        // Set aria attributes
        popup.setAttribute('aria-hidden', 'true');
        popup.classList.remove('is-visible');

        // Animate with GSAP if available, otherwise use CSS
        if (typeof gsap !== 'undefined') {
            gsap.to(popup, {
                duration: this.options.animationDuration,
                autoAlpha: 0,
                display: 'none',
                ease: 'power2.in',
                onComplete: () => {
                    this.restoreFocus(popupId);
                }
            });
        } else {
            // Fallback to CSS transitions
            popup.style.opacity = '0';
            popup.style.display = 'none';

            setTimeout(() => {
                this.restoreFocus(popupId);
            }, this.options.animationDuration * 1000);
        }
    }

    /**
     * Setup focus trap for accessibility
     */
    setupFocusTrap(popupId) {
        const popupData = this.activePopups.get(popupId);
        if (!popupData) return;

        const popup = popupData.element;
        const focusableElements = popup.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        // Remove existing handler if any
        this.removeFocusTrap(popupId);

        // Add new handler
        popup.addEventListener('keydown', handleTabKey);
        this.focusTrapHandlers.set(popupId, handleTabKey);
    }

    /**
     * Remove focus trap
     */
    removeFocusTrap(popupId) {
        const popupData = this.activePopups.get(popupId);
        if (!popupData) return;

        const handler = this.focusTrapHandlers.get(popupId);
        if (handler) {
            popupData.element.removeEventListener('keydown', handler);
            this.focusTrapHandlers.delete(popupId);
        }
    }

    /**
     * Focus first element in popup
     */
    focusFirstElement(popup) {
        const focusableElements = popup.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    /**
     * Restore focus to trigger element
     */
    restoreFocus(popupId) {
        const triggerElement = this.triggerElements.get(popupId);
        if (triggerElement && typeof triggerElement.focus === 'function') {
            triggerElement.focus();
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Escape key to close popup
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Find the currently open popup
                for (const [popupId, popupData] of this.activePopups) {
                    if (popupData.isOpen) {
                        this.closePopup(popupId);
                        break;
                    }
                }
            }
        });

        // Close popup when clicking overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup-framework-overlay')) {
                // Find the popup that contains this overlay
                for (const [popupId, popupData] of this.activePopups) {
                    if (popupData.element.contains(e.target)) {
                        this.closePopup(popupId);
                        break;
                    }
                }
            }

            // Close popup when clicking close button
            const closeBtn = e.target.closest?.('.popup-framework-close');
            if (closeBtn) {
                for (const [popupId, popupData] of this.activePopups) {
                    if (popupData.element.contains(closeBtn)) {
                        this.closePopup(popupId);
                        break;
                    }
                }
            }
        });
    }

    /**
     * GDPR Compliance Methods
     */
    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem(this.options.storageKey);
            if (preferences) {
                return JSON.parse(preferences);
            }
        } catch (error) {
            console.warn('Could not load user preferences:', error);
        }
        return {};
    }

    saveUserPreferences(preferences) {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(preferences));
        } catch (error) {
            console.warn('Could not save user preferences:', error);
        }
    }

    hasConsent(consentType) {
        if (!this.options.gdprCompliance) return true;

        const preferences = this.loadUserPreferences();

        if (!preferences.consents) return false;

        // Support a single consent type or a list of required consents.
        if (Array.isArray(consentType)) {
            return consentType.every((t) => Boolean(preferences.consents[t]));
        }

        return Boolean(preferences.consents[consentType]);
    }

    giveConsent(consentType, granted = true) {
        if (!this.options.gdprCompliance) return;

        const preferences = this.loadUserPreferences();
        if (!preferences.consents) {
            preferences.consents = {};
        }
        preferences.consents[consentType] = granted;
        preferences.lastUpdated = new Date().toISOString();

        this.saveUserPreferences(preferences);
    }

    hasBeenShown(popupId) {
        const preferences = this.loadUserPreferences();
        return preferences.shownPopups && preferences.shownPopups.includes(popupId);
    }

    markAsShown(popupId) {
        const preferences = this.loadUserPreferences();
        if (!preferences.shownPopups) {
            preferences.shownPopups = [];
        }

        if (!preferences.shownPopups.includes(popupId)) {
            preferences.shownPopups.push(popupId);
            preferences.lastUpdated = new Date().toISOString();
            this.saveUserPreferences(preferences);
        }
    }

    /**
     * Analytics Methods
     */
    trackEvent(eventName, action, popupId) {
        if (!this.options.enableAnalytics) return;

        const eventData = {
            event: eventName,
            action: action,
            popup_id: popupId,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            page_url: window.location.href
        };

        // Call custom analytics callback if provided
        if (this.options.analyticsCallback) {
            this.options.analyticsCallback(eventData);
        }

        // Default console logging for development
        console.log('Popup Analytics:', eventData);
    }

    /**
     * Utility Methods
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Public API Methods
     */
    isOpen(popupId) {
        const popupData = this.activePopups.get(popupId);
        return popupData ? popupData.isOpen : false;
    }

    closeAllPopups() {
        const promises = [];
        for (const [popupId, popupData] of this.activePopups) {
            if (popupData.isOpen) {
                promises.push(this.closePopup(popupId));
            }
        }
        return Promise.all(promises);
    }

    destroy() {
        // Clean up all event listeners and data
        this.closeAllPopups();

        for (const [popupId, handler] of this.focusTrapHandlers) {
            const popupData = this.activePopups.get(popupId);
            if (popupData) {
                popupData.element.removeEventListener('keydown', handler);
            }
        }

        this.activePopups.clear();
        this.focusTrapHandlers.clear();
        this.triggerElements.clear();
    }
}

// Initialize the popup framework
window.PopupFramework = PopupFramework;

// Auto-initialize with default options
window.popupFramework = new PopupFramework({
    enableAnalytics: true,
    gdprCompliance: true,
    analyticsCallback: (eventData) => {
        // Send to your analytics service here
        // Example: gtag('event', eventData.event, eventData);
    }
});
