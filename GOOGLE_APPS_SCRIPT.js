// ============================================================
// INSTRUCTIONS: How to set up the Google Apps Script
// ============================================================
// 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1lpGjHoIQHyZxX_2F3goxFVr1WoOMwapockEXPjZyHWg/
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code and paste everything below this comment block
// 4. Click "Deploy" > "New deployment"
// 5. Choose type: "Web app"
// 6. Set "Execute as": Me
// 7. Set "Who has access": Anyone
// 8. Click "Deploy" and copy the URL
// 9. Paste that URL into src/utils/sheetLogger.js (replace the placeholder)
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Stage',
        'Student Name',
        'Student ID',
        'Result',
        'Attempts',
        'Feedback'
      ]);
      // Bold the header row
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      data.name || '',
      data.email || '',
      data.stage || '',
      data.studentName || '',
      data.studentId || '',
      data.result || '',
      data.attempts || '',
      data.feedback || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Sheet logger is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
