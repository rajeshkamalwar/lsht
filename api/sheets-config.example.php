<?php
/**
 * Copy this file to sheets-config.php and fill in your Google Apps Script web app URL.
 *
 * 1. Deploy google-sheets/recurring-donation-webhook.gs (see comments in that file)
 * 2. Paste the deployment URL below
 * 3. Use the same SHEET_SECRET in the .gs file and here
 */
return [
    'webhook_url' => 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    'secret' => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',
];
