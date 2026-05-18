<?php
/**
 * Send HTML email via GoDaddy SMTP or PHP mail() fallback.
 *
 * On GoDaddy shared hosting, outbound smtpout.secureserver.net:465 is often blocked;
 * this module retries via relay-hosting.secureserver.net:25 (no auth) automatically.
 */

function lsht_mail_last_error(): string
{
    return (string) ($GLOBALS['lsht_mail_last_error'] ?? '');
}

function lsht_mail_set_error(string $message): void
{
    $GLOBALS['lsht_mail_last_error'] = $message;
    error_log('LSHT mail: ' . $message);
}

function lsht_load_smtp_config(): ?array
{
    $path = __DIR__ . '/smtp-config.php';
    if (!is_file($path)) {
        return null;
    }
    $config = require $path;
    if (!is_array($config) || empty($config['enabled'])) {
        return null;
    }
    if (empty($config['host'])) {
        return null;
    }
    return $config;
}

function lsht_godaddy_relay_config(array $base): array
{
    return [
        'host' => 'relay-hosting.secureserver.net',
        'port' => 25,
        'encryption' => 'none',
        'username' => '',
        'password' => '',
        'from_email' => $base['from_email'] ?? 'info@shivatemple.nl',
        'from_name' => $base['from_name'] ?? 'Lord Shiva Hindu Temples Amsterdam',
    ];
}

function lsht_localhost_relay_config(array $base): array
{
    return [
        'host' => 'localhost',
        'port' => 25,
        'encryption' => 'none',
        'username' => '',
        'password' => '',
        'from_email' => $base['from_email'] ?? 'info@shivatemple.nl',
        'from_name' => $base['from_name'] ?? 'Lord Shiva Hindu Temples Amsterdam',
    ];
}

function lsht_is_production_host(): bool
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? ''));
    return $host !== '' && strpos($host, 'shivatemple.nl') !== false;
}

/** @return list<array> */
function lsht_smtp_transport_chain(?array $primary, array $base): array
{
    $chain = [];
    if (lsht_is_production_host()) {
        $chain[] = lsht_godaddy_relay_config($base);
        $chain[] = lsht_localhost_relay_config($base);
        if ($primary) {
            $chain[] = $primary;
        }
        return $chain;
    }
    if ($primary) {
        $chain[] = $primary;
    }
    foreach (lsht_smtp_fallback_configs($base, $primary) as $fallback) {
        $chain[] = $fallback;
    }
    return $chain;
}

/** @return list<array> */
function lsht_smtp_fallback_configs(array $base, ?array $primary): array
{
    $fallbacks = [];
    $primaryHost = strtolower((string) ($primary['host'] ?? ''));

    if ($primaryHost !== 'relay-hosting.secureserver.net') {
        $fallbacks[] = lsht_godaddy_relay_config($base);
    }
    if ($primaryHost !== 'localhost') {
        $fallbacks[] = lsht_localhost_relay_config($base);
    }

    return $fallbacks;
}

function lsht_encode_header(string $text): string
{
    if (preg_match('/[^\x20-\x7E]/', $text)) {
        return '=?UTF-8?B?' . base64_encode($text) . '?=';
    }
    return $text;
}

function lsht_smtp_read($socket): string
{
    $data = '';
    while ($line = fgets($socket, 515)) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function lsht_smtp_expect($socket, array $codes): bool
{
    $response = lsht_smtp_read($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $codes, true)) {
        lsht_mail_set_error('SMTP unexpected response: ' . trim($response));
        return false;
    }
    return true;
}

function lsht_smtp_cmd($socket, string $command, array $okCodes): bool
{
    fwrite($socket, $command . "\r\n");
    return lsht_smtp_expect($socket, $okCodes);
}

function lsht_smtp_prepare_body(string $body): string
{
    $body = str_replace(["\r\n", "\r"], "\n", $body);
    $lines = explode("\n", $body);
    $out = [];
    foreach ($lines as $line) {
        if (strlen($line) > 900) {
            $chunks = str_split($line, 900);
            foreach ($chunks as $chunk) {
                if (isset($chunk[0]) && $chunk[0] === '.') {
                    $chunk = '.' . $chunk;
                }
                $out[] = $chunk;
            }
            continue;
        }
        if (isset($line[0]) && $line[0] === '.') {
            $line = '.' . $line;
        }
        $out[] = $line;
    }
    return implode("\r\n", $out);
}

/**
 * Shrink signature data URLs before embedding in HTML email.
 */
function lsht_compress_signature_data_url(string $signature, int $maxW = 320, int $maxH = 140): string
{
    if (!preg_match('/^data:image\/(png|jpe?g|webp);base64,(.+)$/i', $signature, $m)) {
        return $signature;
    }
    $raw = base64_decode($m[2], true);
    if ($raw === false || !function_exists('imagecreatefromstring')) {
        return $signature;
    }
    $img = @imagecreatefromstring($raw);
    if (!$img) {
        return $signature;
    }
    $w = imagesx($img);
    $h = imagesy($img);
    if ($w < 1 || $h < 1) {
        imagedestroy($img);
        return $signature;
    }
    $scale = min(1.0, $maxW / $w, $maxH / $h);
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));
    $out = imagecreatetruecolor($nw, $nh);
    if (!$out) {
        imagedestroy($img);
        return $signature;
    }
    $white = imagecolorallocate($out, 255, 255, 255);
    imagefill($out, 0, 0, $white);
    imagecopyresampled($out, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagedestroy($img);
    ob_start();
    imagejpeg($out, null, 85);
    imagedestroy($out);
    $jpeg = ob_get_clean();
    if ($jpeg === false || $jpeg === '') {
        return $signature;
    }
    return 'data:image/jpeg;base64,' . base64_encode($jpeg);
}

function lsht_send_via_smtp(array $config, string $to, string $subject, string $html, ?string $replyToEmail = null, ?string $replyToName = null): bool
{
    $host = $config['host'];
    $port = (int) ($config['port'] ?? 465);
    $encryption = strtolower((string) ($config['encryption'] ?? 'ssl'));
    $useAuth = !empty($config['username']) && array_key_exists('password', $config);

    if ($encryption === 'none' || $encryption === '') {
        $remote = 'tcp://' . $host . ':' . $port;
    } else {
        $remote = ($encryption === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    }

    $socket = @stream_socket_client(
        $remote,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT,
        stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false,
            ],
        ])
    );

    if (!$socket) {
        lsht_mail_set_error("SMTP connect failed ({$host}:{$port}): {$errstr} ({$errno})");
        return false;
    }

    stream_set_timeout($socket, 20);

    if (!lsht_smtp_expect($socket, [220])) {
        fclose($socket);
        return false;
    }

    if (!lsht_smtp_cmd($socket, 'EHLO shivatemple.nl', [250])) {
        fclose($socket);
        return false;
    }

    if ($useAuth) {
        if (!lsht_smtp_cmd($socket, 'AUTH LOGIN', [334])) {
            fclose($socket);
            return false;
        }
        if (!lsht_smtp_cmd($socket, base64_encode((string) $config['username']), [334])) {
            fclose($socket);
            return false;
        }
        if (!lsht_smtp_cmd($socket, base64_encode((string) $config['password']), [235])) {
            fclose($socket);
            return false;
        }
    }

    $fromEmail = $config['from_email'] ?? ($config['username'] ?? 'info@shivatemple.nl');
    $fromName = $config['from_name'] ?? 'Lord Shiva Hindu Temples';

    if (!lsht_smtp_cmd($socket, 'MAIL FROM:<' . $fromEmail . '>', [250])) {
        fclose($socket);
        return false;
    }
    if (!lsht_smtp_cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251])) {
        fclose($socket);
        return false;
    }
    if (!lsht_smtp_cmd($socket, 'DATA', [354])) {
        fclose($socket);
        return false;
    }

    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
    $headers[] = 'From: ' . lsht_encode_header($fromName) . ' <' . $fromEmail . '>';
    $headers[] = 'To: <' . $to . '>';
    $headers[] = 'Subject: ' . lsht_encode_header($subject);
    if ($replyToEmail) {
        $replyName = $replyToName ? lsht_encode_header($replyToName) . ' ' : '';
        $headers[] = 'Reply-To: ' . $replyName . '<' . $replyToEmail . '>';
    }
    $headers[] = 'Date: ' . date('r');
    $headers[] = 'X-Mailer: LSHT-PHP';

    $body = lsht_smtp_prepare_body($html);
    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    fwrite($socket, $message . "\r\n.\r\n");

    if (!lsht_smtp_expect($socket, [250])) {
        fclose($socket);
        return false;
    }

    lsht_smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);
    return true;
}

function lsht_send_via_mail(string $to, string $subject, string $html, string $fromEmail, string $fromName, ?string $replyToEmail = null): bool
{
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= 'From: ' . lsht_encode_header($fromName) . " <{$fromEmail}>\r\n";
    if ($replyToEmail) {
        $headers .= "Reply-To: {$replyToEmail}\r\n";
    }
    $sent = @mail($to, $subject, $html, $headers);
    if (!$sent) {
        lsht_mail_set_error('PHP mail() returned false');
    }
    return $sent;
}

/**
 * @param array{to?:string,subject:string,html:string,reply_to_email?:?string,reply_to_name?:?string} $options
 */
function lsht_send_mail(array $options): bool
{
    $GLOBALS['lsht_mail_last_error'] = '';
    $config = lsht_load_smtp_config();
    $to = $options['to'] ?? ($config['default_to'] ?? 'info@shivatemple.nl');
    $subject = $options['subject'];
    $html = $options['html'];
    $replyTo = $options['reply_to_email'] ?? null;
    $replyToName = $options['reply_to_name'] ?? null;

    $fromEmail = 'info@shivatemple.nl';
    $fromName = 'Lord Shiva Hindu Temples Amsterdam';
    if ($config) {
        $fromEmail = $config['from_email'] ?? $config['username'] ?? $fromEmail;
        $fromName = $config['from_name'] ?? $fromName;
    }

    $base = ['from_email' => $fromEmail, 'from_name' => $fromName];

    foreach (lsht_smtp_transport_chain($config, $base) as $transport) {
        if (lsht_send_via_smtp($transport, $to, $subject, $html, $replyTo, $replyToName)) {
            return true;
        }
    }

    return lsht_send_via_mail($to, $subject, $html, $fromEmail, $fromName, $replyTo);
}
