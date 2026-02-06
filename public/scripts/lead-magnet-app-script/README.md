# Lead Magnet Framework v1.0
### PART 1: The Human's Task (Backend Infrastructure)

**Goal:** Create a universal endpoint that accepts *any* form data.

1.  **Create a Google Sheet:**
    *   **Tab Name:** Rename the tab at the bottom to exactly `Leads` (Case Sensitive). This is critical.
    *   **Row 1 (Headers):** `Timestamp` | `Email` | `FirstName` (Add any other columns you want here. They must match the HTML `name` attributes exactly, including spaces).
2.  **Open Apps Script:** (Extensions > Apps Script)
3.  **Paste Code:** Delete existing code and paste this:

```javascript
/*
  UNIVERSAL FORM HANDLER
  1. Matches incoming "name" attributes to Sheet Headers.
  2. Timestamp is auto-generated.
*/
const SHEET_NAME = "Leads";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    // Get headers to ensure we map data to correct columns
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      if (header === 'Timestamp') return new Date();
      return e.parameter[header] || ''; // Returns empty string if field is missing
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Return Success JSON
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    // Return Error JSON
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```
4.  **Deploy:**
    *   **Deploy** > **New Deployment** > **Web App**.
    *   Who has access: **Anyone**.
    *   Copy the **Web App URL**.

---

### PART 2: The Agent's Task (Frontend Component)

**Instructions for Implementation:**
1.  Copy the code below into the landing page.
2.  Update `CONFIG` at the bottom with the Web App URL and PDF URL.
3.  Style the classes (marked with `TODO`) to match the specific page design.

```html
<!-- LEAD MAGNET FRAMEWORK (v1.0) -->
<section id="lead-magnet-component" class="w-full max-w-md mx-auto">

  <!-- STATE 1: THE INPUT FORM -->
  <form id="lm-form" class="flex flex-col gap-4 transition-opacity duration-300">

    <!--
      DYNAMIC FIELDS AREA
      Rule: input 'name' must match Google Sheet Header exactly (Case Sensitive).
    -->

    <!-- Field: First Name (Optional Example) -->
    <div class="flex flex-col gap-1">
      <label for="fname" class="text-sm font-medium text-gray-700">First Name</label>
      <input
        type="text"
        id="fname"
        name="FirstName"
        class="w-full px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Jane"
      >
    </div>

    <!-- Field: Email (Required) -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
      <input
        type="email"
        id="email"
        name="Email"
        required
        class="w-full px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="jane@example.com"
      >
    </div>

    <!-- Honeypot (Spam Protection - Keep Hidden) -->
    <div class="hidden" aria-hidden="true">
       <input type="text" name="honeypot" tabindex="-1" autocomplete="off">
    </div>

    <!-- Action Button -->
    <button
      type="submit"
      id="lm-submit"
      class="mt-2 w-full py-3 px-6 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span id="btn-text">Download PDF</span>
    </button>

    <!-- Error Feedback -->
    <p id="form-error" class="hidden text-sm text-red-600 text-center mt-2" role="alert"></p>
  </form>

  <!-- STATE 2: SUCCESS MESSAGE (Hidden by default) -->
  <div id="lm-success" class="hidden text-center py-6 animate-fade-in" aria-live="polite">
    <h3 class="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
    <p class="text-gray-600 mb-4">
      Your guide is downloading.
    </p>
    <a
      id="manual-download"
      href="#"
      download
      class="text-sm text-blue-600 underline hover:text-blue-800"
    >
      Click here if the download didn't start.
    </a>
  </div>

</section>

<!-- LOGIC & CONFIGURATION -->
<script>
  (() => {
    // --- 1. CONFIGURATION ---
    const CONFIG = {
      scriptUrl: "REPLACE_WITH_YOUR_GOOGLE_APPS_SCRIPT_URL",
      fileUrl: "REPLACE_WITH_YOUR_PDF_URL",
      autoDownload: true
    };

    // --- 2. DOM ELEMENTS ---
    const form = document.getElementById('lm-form');
    const submitBtn = document.getElementById('lm-submit');
    const btnText = document.getElementById('btn-text');
    const errorMsg = document.getElementById('form-error');
    const successDiv = document.getElementById('lm-success');
    const manualLink = document.getElementById('manual-download');

    // --- 3. HELPER: DOWNLOAD TRIGGER ---
    const triggerDownload = (url) => {
      manualLink.href = url; // Update fallback link
      if (!CONFIG.autoDownload) return;

      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'download');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500); // Slight delay for UX
    };

    // --- 4. SUBMISSION HANDLER ---
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset State
      errorMsg.classList.add('hidden');
      submitBtn.disabled = true;
      const originalText = btnText.textContent;
      btnText.textContent = "Processing...";

      try {
        const formData = new FormData(form);
        // Convert to URLSearchParams for reliable Google Apps Script submission
        const data = new URLSearchParams();
        for (const pair of formData.entries()) {
            data.append(pair[0], pair[1]);
        }

        // Fetch Request
        const response = await fetch(CONFIG.scriptUrl, {
          method: 'POST',
          body: data
        });

        const result = await response.json();
        if (result.result !== 'success') {
            throw new Error(result.error || 'Submission failed');
        }

        // Success State Transition
        form.classList.add('hidden'); // Hide form
        successDiv.classList.remove('hidden'); // Show success

        // Trigger Download
        if(CONFIG.fileUrl) triggerDownload(CONFIG.fileUrl);

      } catch (err) {
        // Error State
        console.error('Submission Error:', err);
        errorMsg.textContent = "Something went wrong. Please try again.";
        errorMsg.classList.remove('hidden');
        submitBtn.disabled = false;
        btnText.textContent = originalText;
      }
    });
  })();
</script>

<!-- Simple Fade Animation (Optional) -->
<style>
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
```

### How to Instruct the Agent

When you are building a new landing page, you simply give the agent this prompt:

> "Use the **Lead Magnet Framework v1.0**.
> 1.  Set the `scriptUrl` to: [YOUR_URL]
> 2.  Set the `fileUrl` to: [YOUR_PDF_LINK]
> 3.  **Customization:** Add a 'Company Name' text input to the form.
> 4.  **Styling:** Update the button color to match our brand (Green-500) and change the success message headline to 'Your Roadmap is Ready'."

The agent can now safely execute this without rewriting logic or worrying about database connections.