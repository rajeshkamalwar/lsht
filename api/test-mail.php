<?php
/**
 * Send a test email to info@shivatemple.nl — open once in browser after deploy, then delete.
 */
require_once __DIR__ . '/mail-send.php';

header('Content-Type: application/json');

$ok = lsht_send_mail([
    'to' => 'info@shivatemple.nl',
    'subject' => 'LSHT mail test — ' . date('Y-m-d H:i:s'),
    'html' => '<p>This is a test from <code>api/test-mail.php</code> on shivatemple.nl.</p><p>If you received this, PHP mail is working.</p>',
]);

$config = is_file(__DIR__ . '/smtp-config.php') ? require __DIR__ . '/smtp-config.php' : null;

echo json_encode([
    'success' => $ok,
    'error' => lsht_mail_last_error(),
    'smtp_host' => is_array($config) ? ($config['host'] ?? '') : '',
    'smtp_port' => is_array($config) ? ($config['port'] ?? '') : '',
    'hint' => $ok
        ? 'Check inbox and spam for info@shivatemple.nl'
        : 'On GoDaddy, try relay-hosting.secureserver.net port 25 in smtp-config.php (see smtp-config.example.php)',
], JSON_PRETTY_PRINT);
