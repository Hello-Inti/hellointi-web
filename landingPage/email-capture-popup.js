/**
 * Email Capture Popup with Google Form Integration
 * Extends the PopupFramework with email-specific functionality
 */

class EmailCapturePopup {
    constructor(popupFramework, options = {}) {
        this.framework = popupFramework;
        this.options = {
            googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfohvI9FpoPGNsrQv2ErcWO3ZERJiFYWv8ivg5lEqnBoLfJog/viewform?embedded=true',
            submitButtonText: 'Subscribe',
            successMessage: 'Thank you for subscribing!',
            errorMessage: 'Something went wrong. Please try again.',
            requireDoubleOptIn: true,
            ...options
        };

        this.init();
    }

    init() {
        // Register the email capture popup
        this.registerEmailCapturePopup();

        // Setup form handling
        this.setupFormHandling();
    }

    registerEmailCapturePopup() {
        const popupConfig = {
            type: 'email-capture',
            triggerSelector: '.email-capture-trigger',
            requireConsent: ['marketing', 'analytics'],
            showOnce: true,
            analyticsEvent: 'email_capture_popup',
            onBeforeOpen: (popup, trigger) => {
                // Load form content if not already loaded
                return this.loadFormContent(popup);
            },
            onOpen: (popup, trigger) => {
                // Focus on first input field
                const firstInput = popup.querySelector('input[type="email"]');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 300);
                }
            }
        };

        this.framework.registerPopup('email-capture-popup', popupConfig);
    }

    loadFormContent(popup) {
        return new Promise((resolve) => {
            const contentContainer = popup.querySelector('.popup-body');

            if (contentContainer.dataset.loaded === 'true') {
                resolve(true);
                return;
            }

            // Show loading state
            popup.classList.add('loading');

            // Create form content
            const formContent = this.createFormContent();
            contentContainer.innerHTML = formContent;
            contentContainer.dataset.loaded = 'true';

            // Remove loading state
            popup.classList.remove('loading');

            // Setup form event listeners
            this.setupFormEventListeners(popup);

            resolve(true);
        });
    }

    createFormContent() {
        return `
            <div class="email-capture-form">
                <div class="form-intro">
                    <p>Stay updated with our latest alumni engagement strategies and exclusive content.</p>
                </div>

                <form id="email-capture-form" novalidate>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="your@email.com"
                            aria-describedby="email-error"
                        >
                        <div id="email-error" class="error-message" role="alert"></div>
                    </div>

                    <div class="form-group">
                        <label for="name">First Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John"
                        >
                    </div>

                    <div class="gdpr-notice">
                        <h4>Your Privacy Matters</h4>
                        <p>We respect your privacy and are committed to protecting your personal data in accordance with GDPR.</p>

                        <div class="consent-checkboxes">
                            <div class="checkbox-group">
                                <input type="checkbox" id="marketing-consent" name="marketing_consent" required>
                                <label for="marketing-consent">
                                    <strong>Marketing Consent:</strong> I agree to receive marketing emails about alumni engagement strategies, events, and related content. I understand I can unsubscribe at any time.
                                </label>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="analytics-consent" name="analytics_consent" required>
                                <label for="analytics-consent">
                                    <strong>Analytics Consent:</strong> I agree to allow anonymous usage analytics to help improve our services and user experience.
                                </label>
                            </div>

                            ${this.options.requireDoubleOptIn ? `
                            <div class="checkbox-group">
                                <input type="checkbox" id="double-opt-in" name="double_opt_in" required>
                                <label for="double-opt-in">
                                    <strong>Confirmation:</strong> I confirm that I am providing my information voluntarily and understand how it will be used.
                                </label>
                            </div>
                            ` : ''}
                        </div>

                        <p class="privacy-link">
                            <small>
                                Read our <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
                                and <a href="/terms-of-service" target="_blank" rel="noopener">Terms of Service</a>
                                for more information.
                            </small>
                        </p>
                    </div>

                    <button type="submit" class="submit-btn" disabled>
                        <span class="btn-text">${this.options.submitButtonText}</span>
                        <span class="btn-loading" style="display: none;">Processing...</span>
                    </button>

                    <div id="form-error" class="error-message" role="alert"></div>
                </form>
            </div>
        `;
    }

    setupFormEventListeners(popup) {
        const form = popup.querySelector('#email-capture-form');
        const submitBtn = form.querySelector('.submit-btn');
        const emailInput = form.querySelector('#email');
        const marketingConsent = form.querySelector('#marketing-consent');
        const analyticsConsent = form.querySelector('#analytics-consent');

        // Real-time validation
        emailInput.addEventListener('input', () => {
            this.validateEmail(emailInput);
            this.updateSubmitButtonState(form, submitBtn);
        });

        // Consent checkbox listeners
        [marketingConsent, analyticsConsent].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSubmitButtonState(form, submitBtn);
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, popup);
        });
    }

    validateEmail(emailInput) {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            emailInput.setCustomValidity('Email is required');
            errorElement.textContent = 'Email is required';
            return false;
        }

        if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address');
            errorElement.textContent = 'Please enter a valid email address';
            return false;
        }

        emailInput.setCustomValidity('');
        errorElement.textContent = '';
        return true;
    }

    updateSubmitButtonState(form, submitBtn) {
        const emailInput = form.querySelector('#email');
        const marketingConsent = form.querySelector('#marketing-consent');
        const analyticsConsent = form.querySelector('#analytics-consent');
        const doubleOptIn = form.querySelector('#double-opt-in');

        const isEmailValid = this.validateEmail(emailInput);
        const hasMarketingConsent = marketingConsent.checked;
        const hasAnalyticsConsent = analyticsConsent.checked;
        const hasDoubleOptIn = !this.options.requireDoubleOptIn || doubleOptIn.checked;

        const isValid = isEmailValid && hasMarketingConsent && hasAnalyticsConsent && hasDoubleOptIn;

        submitBtn.disabled = !isValid;
    }

    async handleFormSubmit(form, popup) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const errorElement = document.getElementById('form-error');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        errorElement.textContent = '';

        try {
            // Get form data
            const formData = new FormData(form);
            const email = formData.get('email');
            const name = formData.get('name') || '';

            // Store consent preferences
            this.framework.giveConsent('marketing', formData.get('marketing_consent'));
            this.framework.giveConsent('analytics', formData.get('analytics_consent'));

            // Submit to Google Form
            await this.submitToGoogleForm(formData);

            // Show success state
            this.showSuccessState(popup, email, name);

            // Track successful submission
            this.framework.trackEvent('email_capture_form', 'submit', 'success');

        } catch (error) {
            console.error('Form submission error:', error);
            errorElement.textContent = this.options.errorMessage;

            // Track submission error
            this.framework.trackEvent('email_capture_form', 'submit', 'error');

        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    async submitToGoogleForm(formData) {
        return new Promise((resolve, reject) => {
            // Create a hidden iframe for form submission
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'google-form-iframe';

            // Create a form that targets the iframe
            const form = document.createElement('form');
            form.action = this.options.googleFormUrl.replace('viewform?embedded=true', 'formResponse');
            form.method = 'POST';
            form.target = 'google-form-iframe';

            // Map form fields to Google Form field IDs
            // Note: These field IDs need to be extracted from the actual Google Form
            const fieldMappings = {
                'email': 'entry.123456789', // Replace with actual field ID
                'name': 'entry.987654321'   // Replace with actual field ID
            };

            // Add form fields
            for (const [fieldName, fieldId] of Object.entries(fieldMappings)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = fieldId;
                input.value = formData.get(fieldName) || '';
                form.appendChild(input);
            }

            // Handle iframe load event
            iframe.onload = () => {
                // Clean up
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve();
            };

            iframe.onerror = () => {
                // Clean up
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                reject(new Error('Failed to submit form'));
            };

            // Add to DOM and submit
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            form.submit();

            // Timeout after 10 seconds
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                    document.body.removeChild(form);
                    reject(new Error('Form submission timeout'));
                }
            }, 10000);
        });
    }

    showSuccessState(popup, email, name) {
        const contentContainer = popup.querySelector('.popup-body');

        const successContent = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>${this.options.successMessage}</h3>
                <p>Thank you${name ? ', ' + name : ''}! We've sent a confirmation email to <strong>${email}</strong>.</p>
                <p>Please check your inbox and click the confirmation link to complete your subscription.</p>
                <button class="close-btn" onclick="window.popupFramework.closePopup('email-capture-popup')">
                    Close
                </button>
            </div>
        `;

        contentContainer.innerHTML = successContent;
        popup.classList.add('success');

        // Auto-close after 5 seconds
        setTimeout(() => {
            this.framework.closePopup('email-capture-popup');
        }, 5000);
    }

    setupFormHandling() {
        // This method can be extended for additional form handling logic
        // For example, integration with email service providers, etc.
    }

    // Public API methods
    show(triggerElement = null) {
        return this.framework.openPopup('email-capture-popup', triggerElement);
    }

    hide() {
        return this.framework.closePopup('email-capture-popup');
    }

    isOpen() {
        return this.framework.isOpen('email-capture-popup');
    }
}

// Initialize the email capture popup when the framework is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the popup framework to be initialized
    if (window.popupFramework) {
        window.emailCapturePopup = new EmailCapturePopup(window.popupFramework);
    } else {
        // Fallback: wait a bit and try again
        setTimeout(() => {
            if (window.popupFramework) {
                window.emailCapturePopup = new EmailCapturePopup(window.popupFramework);
            }
        }, 100);
    }
});