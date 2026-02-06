/*
  UNIVERSAL FORM HANDLER
  1. Matches incoming "name" attributes to Sheet Headers.
  2. Timestamp is auto-generated.
*/
// IMPORTANT: The Google Sheet tab must be named exactly "Leads" (case-sensitive).
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