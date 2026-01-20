# Custom Google Form Integration Guide

This guide explains how to replace the embedded Google Form iframe with a custom form that matches the HelloInti design system while maintaining the same Google Forms functionality.

## What This Solves

✅ **Full Design Control**: Customize every aspect of the form appearance
✅ **Better Performance**: No iframe loading delays or cross-origin issues
✅ **Enhanced UX**: Real-time validation and better error handling
✅ **Brand Consistency**: Matches HelloInti's design system perfectly
✅ **Same Backend**: Still submits to Google Forms - no data loss
✅ **Auto-Download**: Maintains the PDF download functionality

## Files Created

### 1. `custom-form-template.html`
- Contains the complete HTML structure for the custom form
- Includes built-in CSS that matches HelloInti's design system
- Uses HelloInti colors: poppy (#E65C4F), sunbeam (#F2B705), etc.
- Responsive design with accessibility features
- Success state UI that matches the popup framework

### 2. `custom-form-handler.js`
- JavaScript class that handles form submission to Google Forms
- Integrates seamlessly with the existing popup framework
- Real-time form validation
- Handles auto-download functionality
- Error handling and user feedback
- Analytics tracking integration

## Integration Steps

### Step 1: Include the New Files

Add these lines to your `index.html` file (after the existing popup framework includes):

```html
<!-- Include the new custom form handler -->
<script src="./custom-form-handler.js"></script>
```

### Step 2: Update Popup Configuration (Optional)

The custom form will automatically replace the iframe when the popup opens. No changes needed to your existing button configuration:

```html
<button
    class="relative bg-poppy text-white text-xl font-bold px-10 py-5 rounded-xl hover:bg-poppy/90 transition-all shadow-xl flex items-center gap-3"
    data-popup="lead-magnet-popup"
    data-popup-type="lead-magnet"
    data-popup-title="Get the free playbook"
    data-popup-description="Submit your name + email and your download will start automatically."
    data-form-src="https://docs.google.com/forms/d/e/1FAIpQLSfohvI9FpoPGNsrQv2ErcWO3ZERJiFYWv8ivg5lEqnBoLfJog/viewform?embedded=true"
    data-download-url="./The%20Long%20Game%20Events%20Playbook.pdf"
>
    Download the Playbook
    <i data-feather="download"></i>
</button>
```

### Step 3: Test the Integration

1. Open the page and click the "Download the Playbook" button
2. The popup should now show the custom form instead of the iframe
3. Fill out the form and submit
4. Verify the data appears in your Google Form responses
5. Confirm the PDF auto-download works
6. Test form validation (try submitting with empty fields or invalid email)

## How It Works

### 1. Form Submission Flow
```
User fills custom form → Validation → Submit to Google Forms → Success state → Auto-download PDF
```

### 2. Google Forms Integration
The custom form submits to the same Google Forms endpoint:
```
POST https://docs.google.com/forms/d/e/1FAIpQLSfohvI9FpoPGNsrQv2ErcWO3ZERJiFYWv8ivg5lEqnBoLfJog/formResponse
```

With these field mappings:
- **First Name** → `entry.35533427`
- **Email Address** → `entry.642459452`

### 3. Fallback Mechanism
If the custom form fails to load (e.g., network issues), it automatically falls back to the original iframe approach.

## Customization Options

### Colors and Branding
The form uses HelloInti's design system colors. To modify colors, update the CSS variables in `custom-form-template.html`:

```css
:root {
    --poppy: #E65C4F;
    --sunbeam: #F2B705;
    --charcoal: #403F3E;
    --eggshell: #F2F2F2;
    /* ... other colors */
}
```

### Form Fields
To add or modify form fields:

1. **HTML**: Update `custom-form-template.html` with new input fields
2. **JavaScript**: Update `custom-form-handler.js` validation and submission logic
3. **Google Forms**: Add corresponding fields to your Google Form (get new `entry.xxx` IDs)

### Styling
All styles are included in the template HTML and use:
- HelloInti fonts: 'Lora' (serif) and 'Nunito Sans' (sans-serif)
- Tailwind-inspired utility classes
- Mobile-first responsive design
- Accessibility features (ARIA labels, keyboard navigation)

## Benefits Over Iframe Approach

| Feature | Iframe Approach | Custom Form |
|---------|----------------|-------------|
| **Load Time** | Slower (external iframe) | Instant |
| **Styling Control** | Limited by Google | Full control |
| **User Experience** | Basic Google UI | Branded experience |
| **Validation** | Basic | Real-time, custom |
| **Error Handling** | Generic | Contextual messages |
| **Mobile Experience** | Google's responsive | Optimized for HelloInti |
| **Analytics** | Limited | Full tracking support |
| **Performance** | Cross-origin overhead | Direct submission |

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Accessibility tools (screen readers, keyboard navigation)

## Troubleshooting

### Form Not Loading
- Check browser console for errors
- Ensure `custom-form-template.html` is accessible
- Verify popup framework is initialized

### Submission Failing
- Check Google Form is still active
- Verify field names match Google Form (entry.35533427, entry.642459452)
- Test with browser network tab open

### Auto-Download Not Working
- Check popup blocker settings
- Verify download URL is correct and accessible
- Test manual download link

### Analytics Not Tracking
- Ensure popup framework analytics is enabled
- Check console for analytics errors
- Verify event names match your analytics setup

## Migration Checklist

- [ ] Add `custom-form-handler.js` to page
- [ ] Test form submission to Google Forms
- [ ] Verify auto-download functionality
- [ ] Test form validation (empty fields, invalid email)
- [ ] Check mobile responsiveness
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Test fallback to iframe (disable JavaScript)
- [ ] Confirm analytics tracking works
- [ ] Remove or comment out iframe-related code if desired

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify all files are loading correctly
3. Test the fallback iframe approach
4. Check Google Form responses to confirm submissions

The custom form maintains 100% compatibility with your existing Google Forms setup while providing a much better user experience and complete design control.