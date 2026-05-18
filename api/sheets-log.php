<?php
/**
 * Append recurring donation rows to Google Sheets via Apps Script web app.
 */

function lsht_sheets_last_error(): string
{
    return (string) ($GLOBALS['lsht_sheets_last_error'] ?? '');
}

function lsht_sheets_set_error(string $message): void
{
    $GLOBALS['lsht_sheets_last_error'] = $message;
    error_log('LSHT sheets: ' . $message);
}

function lsht_sheets_is_configured(): bool
{
    $configPath = __DIR__ . '/sheets-config.php';
    if (!is_file($configPath)) {
        return false;
    }
    $config = require $configPath;
    return !empty($config['webhook_url']);
}

/**
 * @param array<string, mixed> $entry
 */
function lsht_append_recurring_donation_to_sheet(array $entry): bool
{
    $GLOBALS['lsht_sheets_last_error'] = '';
    $configPath = __DIR__ . '/sheets-config.php';
    if (!is_file($configPath)) {
        lsht_sheets_set_error('api/sheets-config.php is missing on the server.');
        return false;
    }

    $config = require $configPath;
    $url = isset($config['webhook_url']) ? trim((string) $config['webhook_url']) : '';
    if ($url === '' || strpos($url, 'script.google.com') === false) {
        lsht_sheets_set_error('sheets-config.php webhook_url is empty or invalid.');
        return false;
    }

    $payload = array_merge($entry, [
        'secret' => isset($config['secret']) ? (string) $config['secret'] : '',
    ]);

    $body = json_encode($payload);
    if ($body === false) {
        return false;
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        $opts = [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_FOLLOWLOCATION => true,
        ];
        if (defined('CURLOPT_POSTREDIR')) {
            $opts[CURLOPT_POSTREDIR] = CURL_REDIR_POST_ALL;
        }
        curl_setopt_array($ch, $opts);
        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            lsht_sheets_set_error('Webhook request failed: ' . $curlError);
            return false;
        }
        if ($httpCode < 200 || $httpCode >= 300) {
            lsht_sheets_set_error('Webhook HTTP ' . $httpCode . ': ' . substr((string) $response, 0, 200));
            return false;
        }

        $decoded = json_decode($response, true);
        if (is_array($decoded) && !empty($decoded['success'])) {
            return true;
        }
        lsht_sheets_set_error('Webhook response: ' . substr((string) $response, 0, 200));
        return false;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        lsht_sheets_set_error('Webhook request failed (PHP stream).');
        return false;
    }

    $decoded = json_decode($response, true);
    if (is_array($decoded) && !empty($decoded['success'])) {
        return true;
    }
    lsht_sheets_set_error('Webhook response: ' . substr((string) $response, 0, 200));
    return false;
}
