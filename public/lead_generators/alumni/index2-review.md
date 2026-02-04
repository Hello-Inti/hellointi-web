# Review: index2.html - CTA Button Issue

## Current Setup Analysis

###Correct Elements:
1. ✅ Button has all required data attributes (lines 105-115):
   - `data-popup="lead-magnet-popup"`
   - `data-popup-type="lead-magnet"`
   - `data-form-src="https://docs.google.com/forms/d/e/1FAIpQLSeb0_ZBTH1XWq5J5N2bHmklAnYjAW3KfViM0U_FQ0-WbL8smA/viewform?embedded=true"`
   - `data-download-url="./alumni_blueprint.pdf"`

2. ✅ Popup markup exists with matching ID (lines 406-439)
3. ✅ popup-framework.css is loaded (line 15)
4. ✅ popup-framework.js is loaded (line 441)
5. ✅ Framework auto-initializes at end of script

### Potential Issues Found:

#### Issue #1: Feather Icons Initialization Timing
**Line 444:** `feather.replace()` is called immediately after scripts load. This might execute before the popup framework finishes initializing.

**Fix:** The feather icons should be replaced after a small delay or after DOMContentLoaded.

#### Issue #2: Multiple Script Dependencies
The page loads:
- Tailwind CDN (line 7)
- Feather Icons (line 8)
- GSAP (line 16)
- popup-framework.js (line 441)
- scheduler.js (line 442)

If any script fails to load or has errors, the popup won't work.

#### Issue #3: Google Form URL Embedding
The Google Form URL includes `/viewform?embedded=true` which is correct for embedding, but Google Forms can sometimes have CORS or embedding restrictions.

### Recommended Debug Steps:

1. **Open browser console** and check for JavaScript errors
2. **Check if popup framework initialized:** Type `popupFramework` in console
3. **Check if popup registered:** Type `popupFramework.activePopups.size` (should be > 0)
4. **Manually trigger:** Type `popupFramework.openPopup('lead-magnet-popup')` to test if popup opens
5. **Check button event listener:** Right-click button > Inspect > Event Listeners tab

### Quick Fix to Try:

Wrap the feather.replace() call in DOMContentLoaded to ensure everything is loaded:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
});
```

Or add a small delay:

```javascript
setTimeout(() => {
    feather.replace();
}, 100);
```

### Testing Checklist:

- [ ] Does the button have a click cursor?
- [ ] Are there any console errors when clicking?
- [ ] Does `window.popupFramework` exist in console?
- [ ] Does the popup element have click handlers attached?
- [ ] Can you manually open the popup via console?
- [ ] Is the Google Form URL accessible in an iframe?

### Most Likely Cause:

Based on the code review, the most likely issue is that the popup framework is working correctly, but there may be:
1. A JavaScript error preventing initialization (check console)
2. The Google Form URL might not be embeddable (check in separate iframe)
3. The button click handler isn't being attached (timing issue)

### Testing the Google Form URL:

Create a simple test to see if the form can be embedded:

```html
<iframe
    src="https://docs.google.com/forms/d/e/1FAIpQLSeb0_ZBTH1XWq5J5N2bHmklAnYjAW3KfViM0U_FQ0-WbL8smA/viewform?embedded=true"
    width="640"
    height="800">
</iframe>
```

