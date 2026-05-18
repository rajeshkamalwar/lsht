<?php
/**
 * Append recurring donation rows to Google Sheets via Apps Script web app.
 */

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
    $configPath = __DIR__ . '/sheets-config.php';
    if (!is_file($configPath)) {
        return true;
    }

    $config = require $configPath;
    $url = isset($config['webhook_url']) ? trim((string) $config['webhook_url']) : '';
    if ($url === '') {
        return true;
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
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_FOLLOWLOCATION => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $httpCode < 200 || $httpCode >= 300) {
            error_log('Google Sheets webhook HTTP error: ' . $httpCode);
            return false;
        }

        $decoded = json_decode($response, true);
        return is_array($decoded) && !empty($decoded['success']);
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
        error_log('Google Sheets webhook request failed (stream).');
        return false;
    }

    $decoded = json_decode($response, true);
    return is_array($decoded) && !empty($decoded['success']);
}
