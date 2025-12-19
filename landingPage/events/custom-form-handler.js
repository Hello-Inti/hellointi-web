document.addEventListener('DOMContentLoaded', () => {
    const leadMagnetPopup = document.getElementById('lead-magnet-popup');
    if (!leadMagnetPopup) return;

    const formPlaceholder = leadMagnetPopup.querySelector('[data-lead-magnet-iframe-placeholder]');
    const popupBody = leadMagnetPopup.querySelector('.popup-body');
    const downloadLink = leadMagnetPopup.querySelector('[data-download-link]');

    // Get form details from the button that triggered the popup
    const triggerButton = document.querySelector('[data-popup="lead-magnet-popup"]');
    const formActionUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfohvI9FpoPGNsrQv2ErcWO3ZERJiFYWv8ivg5lEqnBoLfJog/formResponse?embedded=true";
    const downloadUrl = triggerButton.dataset.downloadUrl;
    const formTitle = triggerButton.dataset.popupTitle;
    const formDescription = triggerButton.dataset.popupDescription;

    // Set fallback download link
    if (downloadLink && downloadUrl) {
        downloadLink.href = downloadUrl;
    }

    // Fetch the custom form template
    fetch('custom-form-template.html')
        .then(response => response.text())
        .then(html => {
            // Replace the iframe with the custom form HTML
            if (formPlaceholder) {
                formPlaceholder.innerHTML = html; // Insert custom form

                const customFormContainer = formPlaceholder.querySelector('.custom-form-container');
                const customForm = customFormContainer.querySelector('#lead-magnet-custom-form');
                const confirmationMessage = customFormContainer.querySelector('#form-confirmation-message');
                const fallbackDownloadLink = customFormContainer.querySelector('#fallback-download-link');
                const formHeaderTitle = customFormContainer.querySelector('[data-form-title]');
                const formHeaderDescription = customFormContainer.querySelector('[data-form-description]');

                // Update form header based on trigger button data
                if (formHeaderTitle) formHeaderTitle.textContent = formTitle;
                if (formHeaderDescription) formHeaderDescription.textContent = formDescription;
                if (fallbackDownloadLink) fallbackDownloadLink.href = downloadUrl;

                // Initialize Feather Icons for the new download icon
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }

                if (customForm) {
                    customForm.addEventListener('submit', function(event) {
                        event.preventDefault(); // Prevent default form submission

                        const formData = new FormData(this);
                        const firstNameInput = customForm.querySelector('#first-name');
                        const emailAddressInput = customForm.querySelector('#email-address');
                        const firstName = firstNameInput.value.trim();
                        const emailAddress = emailAddressInput.value.trim();

                        // Basic client-side validation
                        let isValid = true;

                        // Validate First Name
                        if (firstName === '') {
                            firstNameInput.classList.add('border-red-500');
                            isValid = false;
                        } else {
                            firstNameInput.classList.remove('border-red-500');
                        }

                        // Validate Email Address
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(emailAddress)) {
                            emailAddressInput.classList.add('border-red-500');
                            isValid = false;
                        } else {
                            emailAddressInput.classList.remove('border-red-500');
                        }

                        if (!isValid) {
                            // Optionally, display a general error message or specific field errors
                            console.error('Form validation failed.');
                            return; // Stop submission if validation fails
                        }

                        // Construct the URL for Google Forms submission
                        const googleFormUrl = `${formActionUrl}&entry.35533427=${encodeURIComponent(firstName)}&entry.642459452=${encodeURIComponent(emailAddress)}`;

                        // Submit to Google Forms (using a hidden iframe to avoid navigation)
                        const hiddenIframe = document.createElement('iframe');
                        hiddenIframe.style.display = 'none';
                        hiddenIframe.src = googleFormUrl;
                        document.body.appendChild(hiddenIframe);

                        hiddenIframe.onload = () => {
                            // Trigger PDF download
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = downloadUrl.split('/').pop(); // Suggest filename
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            // Display confirmation message
                            if (confirmationMessage) {
                                confirmationMessage.classList.remove('hidden');
                            }
                            customForm.reset(); // Clear the form
                            customForm.style.display = 'none'; // Hide the form
                            hiddenIframe.remove(); // Clean up the iframe
                        };

                        hiddenIframe.onerror = () => {
                            console.error('Google Forms submission failed.');
                            // Optionally, display an error message
                            if (confirmationMessage) {
                                confirmationMessage.innerHTML = '<p class="font-semibold mb-2 text-red-600">There was an error submitting the form. Please try again or use the fallback link.</p>';
                                confirmationMessage.classList.remove('hidden');
                            }
                        };
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error loading custom form template:', error);
            // Fallback to original iframe behavior if custom form fails to load
            // This part is commented out as the iframe is now replaced by a placeholder.
            // If a full fallback to the original iframe is needed, the placeholder
            // would need to be reverted or the iframe re-inserted.
            // if (formPlaceholder) {
            //     formPlaceholder.innerHTML = '<iframe data-lead-magnet-iframe class="lead-magnet-iframe" title="HelloInti lead magnet signup form" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + triggerButton.dataset.formSrc + '" style="display:block;"></iframe>';
            // }
        });
});