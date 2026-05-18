/**
 * Lord Shiva Hindu Temples — Recurring donation → Google Sheet
 *
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1gVNnWbHTmAFD-tlzuWF7_aXspuDzeO7lHXfx0hWt6qE/
 *
 * Setup:
 * 1. Open the spreadsheet → Extensions → Apps Script
 * 2. Paste this entire file (replace any default code)
 * 3. Set SHEET_SECRET below to a long random string (same value in api/sheets-config.php on the server)
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL into api/sheets-config.php as webhook_url
 */

const SPREADSHEET_ID = '1gVNnWbHTmAFD-tlzuWF7_aXspuDzeO7lHXfx0hWt6qE';
const SHEET_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';

const HEADERS = [
  'Submitted At',
  'Title',
  'Full Name',
  'Address',
  'Phone',
  'Email',
  'ZIP Code & Place',
  'Bank Account (IBAN)',
  'Monthly Amount (EUR)',
  'Starting Date',
  'Place',
  'Signature Date',
  'Signature',
  'Authorized',
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (SHEET_SECRET && SHEET_SECRET !== 'CHANGE_ME_TO_A_LONG_RANDOM_STRING') {
      if (!payload.secret || payload.secret !== SHEET_SECRET) {
        return jsonResponse({ success: false, error: 'Unauthorized' });
      }
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    ensureHeaders_(sheet);

    sheet.appendRow([
      payload.submittedAt || new Date(),
      payload.salutation || '',
      payload.fullName || '',
      payload.address || '',
      payload.phone || '',
      payload.email || '',
      payload.zipCity || '',
      payload.bankAccount || '',
      payload.monthlyAmount || '',
      payload.startingDate || '',
      payload.place || '',
      payload.signatureDate || '',
      payload.signature || '',
      payload.authorized ? 'Yes' : 'No',
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const empty = firstRow.every(function (cell) { return cell === '' || cell === null; });
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
