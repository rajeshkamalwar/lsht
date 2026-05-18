<?php
/**
 * Copy to sheets-config.php on GoDaddy (same folder as recurring-donation.php).
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1gVNnWbHTmAFD-tlzuWF7_aXspuDzeO7lHXfx0hWt6qE/edit
 *
 * 1. Open the sheet → Extensions → Apps Script
 * 2. Paste google-sheets/recurring-donation-webhook.gs → Save
 * 3. Set SHEET_SECRET in the .gs file (long random string)
 * 4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
 * 5. Copy the Web app URL (ends with /exec) below
 * 6. Use the same SHEET_SECRET here
 * 7. Upload sheets-config.php to public_html/api/ on GoDaddy
 * 8. Test: open https://shivatemple.nl/api/setup-status.php in the browser
 */
return [
    'webhook_url' => 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    'secret' => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',
];
