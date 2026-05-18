<?php
/**
 * One-time server check (upload api/setup-status.php, open in browser, then remove).
 */
header('Content-Type: application/json');

require_once __DIR__ . '/mail-send.php';
require_once __DIR__ . '/sheets-log.php';

$status = [
    'mail_send_php' => is_file(__DIR__ . '/mail-send.php'),
    'recurring_donation_php' => is_file(__DIR__ . '/recurring-donation.php'),
    'smtp_config' => is_file(__DIR__ . '/smtp-config.php'),
    'smtp_enabled' => false,
    'sheets_config' => is_file(__DIR__ . '/sheets-config.php'),
    'sheets_webhook_set' => lsht_sheets_is_configured(),
    'gd_extension' => extension_loaded('gd'),
    'curl' => function_exists('curl_init'),
];

if ($status['smtp_config']) {
    $smtp = require __DIR__ . '/smtp-config.php';
    $status['smtp_enabled'] = is_array($smtp) && !empty($smtp['enabled']);
    $status['smtp_host'] = is_array($smtp) ? ($smtp['host'] ?? '') : '';
    $status['smtp_port'] = is_array($smtp) ? ($smtp['port'] ?? '') : '';
}

if (!empty($_GET['test_mail']) && $_GET['test_mail'] === '1') {
    $status['mail_test'] = lsht_send_mail([
        'to' => 'info@shivatemple.nl',
        'subject' => 'LSHT setup mail test — ' . date('c'),
        'html' => '<p>Test from setup-status.php</p>',
    ]) ? 'sent' : 'failed';
    $status['mail_test_error'] = lsht_mail_last_error();
}

if ($status['sheets_webhook_set']) {
    $config = require __DIR__ . '/sheets-config.php';
    $url = trim((string) ($config['webhook_url'] ?? ''));
    $status['sheets_webhook_host'] = parse_url($url, PHP_URL_HOST);
    $status['sheets_ping'] = 'skipped';
    if (function_exists('curl_init') && $url !== '') {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_FOLLOWLOCATION => true,
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $decoded = json_decode((string) $body, true);
        $bodyStart = substr((string) $body, 0, 200);
        $isSignInPage = stripos($bodyStart, 'accounts.google.com') !== false
            || stripos($bodyStart, '<!doctype html') !== false;
        $pingOk = is_array($decoded) && !empty($decoded['success']);
        $status['sheets_ping'] = [
            'http' => $code,
            'success' => $pingOk,
            'body' => substr((string) $body, 0, 120),
        ];
        if (!$pingOk && $isSignInPage) {
            $status['sheets_ping']['fix'] = 'In Apps Script: Deploy → Manage deployments → Edit → Who has access: Anyone → New version → Deploy. Then test the URL in a private/incognito window — you must see JSON, not a Google sign-in page.';
        }
    }
} elseif ($status['sheets_config']) {
    $status['sheets_error'] = lsht_sheets_last_error() ?: 'webhook_url missing in sheets-config.php';
} else {
    $status['sheets_error'] = 'Create api/sheets-config.php from sheets-config.example.php';
}

echo json_encode($status, JSON_PRETTY_PRINT);
