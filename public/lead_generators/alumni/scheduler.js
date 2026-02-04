function initSchedulerPopup() {
    console.log("initSchedulerPopup called");
    const popup = document.getElementById("scheduler-popup");
    const ctas = document.querySelectorAll(".scheduler-cta");
    const overlay = popup.querySelector(".scheduler-popup-overlay");
    const iframe = document.getElementById("scheduler-iframe");
    const iframeSrc = "https://calendly.com/mitramartin1/45min";

    if (!popup || ctas.length === 0 || !overlay || !iframe) {
        console.error("Scheduler popup elements not found. Aborting initialization.");
        return;
    }

    console.log(`Found ${ctas.length} scheduler CTA buttons.`);

    function openPopup(triggerElement) {
        console.log("Opening scheduler popup");
        if (!iframe.src) {
            iframe.src = iframeSrc;
            console.log("Setting iframe src to:", iframeSrc);
        }
        popup.classList.add("is-visible");
        gsap.to(popup, {
            duration: 0.3,
            autoAlpha: 1,
            display: "block",
            ease: "power2.out",
            onComplete: () => {
                popup.setAttribute("aria-hidden", "false");
                setupFocusTrap(popup);
                console.log("Popup opened successfully");
            }
        });
    }

    function closePopup() {
        console.log("Closing scheduler popup");
        gsap.to(popup, {
            duration: 0.3,
            autoAlpha: 0,
            display: "none",
            ease: "power2.in",
            onComplete: () => {
                popup.setAttribute("aria-hidden", "true");
                if (document.activeElement && popup.contains(document.activeElement)) {
                    (triggerElement || document.activeElement).focus();
                }
            }
        });
    }

    function setupFocusTrap(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTabKey(e) {
            if (e.key === "Tab") {
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
        }

        if (!container.dataset.trapInitialized) {
            container.addEventListener("keydown", handleTabKey);
            container.dataset.trapInitialized = "true";
        }

        if (firstElement) {
            firstElement.focus();
        }
    }

    let triggerElement;

    ctas.forEach(cta => {
        console.log("Attaching listener to button:", cta);
        cta.addEventListener("click", function(e) {
            console.log("Scheduler button clicked:", e.target);
            e.preventDefault();
            triggerElement = this;
            openPopup(triggerElement);
        });
    });

    overlay.addEventListener("click", closePopup);

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && popup.getAttribute("aria-hidden") === "false") {
            closePopup();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check if scheduler popup elements exist before initializing
    const popup = document.getElementById("scheduler-popup");
    if (!popup) {
        console.log("Scheduler popup not found on this page, skipping initialization");
        return;
    }

    try {
        initSchedulerPopup();
    } catch (error) {
        console.error("Error initializing scheduler popup:", error);
    }
});