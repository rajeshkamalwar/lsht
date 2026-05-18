<?php
/**
 * Recurring donation authorization (Machtiging) form handler.
 * Sends notification to the temple, a thank-you email to the donor,
 * and optionally appends a row to Google Sheets (see sheets-config.php).
 */

require_once __DIR__ . '/sheets-log.php';
require_once __DIR__ . '/mail-send.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request body.']);
    exit;
}

function field($input, $key) {
    return isset($input[$key]) ? trim((string) $input[$key]) : '';
}

$salutation = field($input, 'salutation');
$fullName = field($input, 'fullName');
$address = field($input, 'address');
$phone = field($input, 'phone');
$email = filter_var(field($input, 'email'), FILTER_VALIDATE_EMAIL);
$zipCity = field($input, 'zipCity');
$bankAccount = field($input, 'bankAccount');
$monthlyAmount = field($input, 'monthlyAmount');
$startingDate = field($input, 'startingDate');
$authorizationPeriod = field($input, 'authorizationPeriod');
$authorized = !empty($input['authorized']);

$periodLabels = [
    '1_month' => '1 month',
    '6_months' => '6 months',
    '1_year' => '1 year',
];

$required = [
    'fullName' => $fullName,
    'address' => $address,
    'phone' => $phone,
    'bankAccount' => $bankAccount,
    'monthlyAmount' => $monthlyAmount,
    'startingDate' => $startingDate,
];

$missing = [];
foreach ($required as $label => $value) {
    if ($value === '') {
        $missing[] = $label;
    }
}
if ($missing !== []) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Please fill in all required fields: ' . implode(', ', $missing) . '.',
    ]);
    exit;
}

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A valid email address is required.']);
    exit;
}

if ($authorizationPeriod === '' && field($input, 'signatureDate') !== '') {
    $authorizationPeriod = '1_year';
}
if (!isset($periodLabels[$authorizationPeriod])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please select an authorization period (1 month, 6 months, or 1 year).']);
    exit;
}

$authorizationPeriodLabel = $periodLabels[$authorizationPeriod];
$signatureDate = date('Y-m-d');

if (!$authorized) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please confirm the authorization to continue.']);
    exit;
}

$signature = field($input, 'signature');
if ($signature === '' || !preg_match('/^data:image\/(png|jpe?g|webp);base64,/i', $signature)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please draw or upload your signature.']);
    exit;
}

if (strlen($signature) > 900000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Signature image is too large. Please use a smaller image or redraw.']);
    exit;
}

$signature = lsht_compress_signature_data_url($signature);

function lsht_format_signature_html(string $signature): string
{
    if (preg_match('/^data:image\/(png|jpe?g|webp);base64,/i', $signature)) {
        return '<img src="' . htmlspecialchars($signature, ENT_QUOTES, 'UTF-8') . '" alt="Signature" style="max-width:320px;max-height:140px;border:1px solid #d7c7de;border-radius:6px;background:#fff;" />';
    }
    return htmlspecialchars($signature, ENT_QUOTES, 'UTF-8');
}

$signatureHtml = lsht_format_signature_html($signature);
$signatureSheet = 'Drawn/uploaded (see email)';

$amountNum = preg_replace('/[^\d.,]/', '', $monthlyAmount);
$amountNum = str_replace(',', '.', $amountNum);
if ($amountNum === '' || !is_numeric($amountNum) || (float) $amountNum <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid monthly amount.']);
    exit;
}

$monthlyFormatted = number_format((float) $amountNum, 2, '.', '');
$displayName = trim(($salutation !== '' ? $salutation . ' ' : '') . $fullName);
$to = 'info@shivatemple.nl';
$adminNotifyEmails = [
    'info@shivatemple.nl',
    'avisharma642002@gmail.com',
];
$templeBank = 'NL13 INGB 0006 5738 64';
$recurringSheetUrl = 'https://docs.google.com/spreadsheets/d/1gVNnWbHTmAFD-tlzuWF7_aXspuDzeO7lHXfx0hWt6qE/edit?usp=sharing';

function lsht_optional_html(string $value): string
{
    return $value !== ''
        ? htmlspecialchars($value, ENT_QUOTES, 'UTF-8')
        : '&mdash;';
}

$rows = [
    'Name' => htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8'),
    'Address' => htmlspecialchars($address, ENT_QUOTES, 'UTF-8'),
    'Phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
    'Email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
    'ZIP' => lsht_optional_html($zipCity),
    'Bank account (donor)' => htmlspecialchars($bankAccount, ENT_QUOTES, 'UTF-8'),
    'Monthly amount' => '&euro;' . htmlspecialchars($monthlyFormatted, ENT_QUOTES, 'UTF-8'),
    'Starting date' => htmlspecialchars($startingDate, ENT_QUOTES, 'UTF-8'),
    'Authorization period' => htmlspecialchars($authorizationPeriodLabel, ENT_QUOTES, 'UTF-8'),
    'Date signed' => htmlspecialchars($signatureDate, ENT_QUOTES, 'UTF-8'),
    'Signature' => $signatureHtml,
];

$tableHtml = '';
foreach ($rows as $label => $value) {
    $tableHtml .= "<tr><td style='padding:8px 12px;font-weight:bold;color:#333;vertical-align:top;'>{$label}</td><td style='padding:8px 12px;color:#555;'>{$value}</td></tr>";
}

$authText = "The undersigned hereby grants authorisation for <strong>" . htmlspecialchars($authorizationPeriodLabel, ENT_QUOTES, 'UTF-8') . "</strong> to Foundation LORD SHIVA HINDU TEMPLES in Amsterdam, "
    . "to debit the bank account stated above periodically per month with &euro;{$monthlyFormatted} for donation, "
    . "to bank account {$templeBank} (Stichting Lord Shiva Hindu Temples te Amsterdam).";

$email_body = "
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;line-height:1.6;color:#333;'>
  <div style='max-width:640px;margin:0 auto;padding:20px;'>
    <div style='background:#4a1d52;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0;'>
      <h2 style='margin:0;'>New Recurring Donation Authorization</h2>
    </div>
    <div style='padding:20px;background:#f9f9f9;border:1px solid #e8dce8;border-top:none;border-radius:0 0 8px 8px;'>
      <p style='margin:0 0 16px;'>{$authText}</p>
      <table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8dce8;'>{$tableHtml}</table>
      <p style='margin-top:16px;padding:12px 14px;background:#fff;border:1px solid #e8dce8;border-radius:6px;font-size:13px;color:#333;'>
        <strong>Spreadsheet log:</strong> This submission is also recorded in the
        <a href='{$recurringSheetUrl}' style='color:#4a1d52;font-weight:600;'>Recurring Donation Entries</a> Google Sheet.
        Please check that link for the full list of authorizations.
      </p>
      <p style='margin-top:12px;font-size:12px;color:#666;'>Submitted via shivatemple.nl donate page.</p>
    </div>
  </div>
</body>
</html>";

$subject = 'Recurring donation authorization – ' . $displayName;
$mailOptions = [
    'subject' => $subject,
    'html' => $email_body,
    'reply_to_email' => $email,
    'reply_to_name' => $displayName,
];
$mail_sent = false;
foreach ($adminNotifyEmails as $adminTo) {
    $options = array_merge($mailOptions, ['to' => $adminTo]);
    $ok = lsht_send_mail($options);
    if ($adminTo === $to) {
        $mail_sent = $ok;
    } elseif (!$ok) {
        error_log('Recurring donation: admin notification failed for ' . $adminTo);
    }
}

$confirmation_subject = 'Thank you – recurring donation authorization received';
$confirmation_body = "
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;line-height:1.6;color:#333;'>
  <div style='max-width:640px;margin:0 auto;padding:20px;'>
    <div style='background:#4a1d52;color:#fff;padding:20px;text-align:center;border-radius:8px 8px 0 0;'>
      <h2 style='margin:0;'>Thank You</h2>
    </div>
    <div style='padding:20px;background:#f9f9f9;border:1px solid #e8dce8;border-top:none;border-radius:0 0 8px 8px;'>
      <p>Dear " . htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') . ",</p>
      <p>Thank you for submitting your recurring donation authorization to Lord Shiva Hindu Temples Amsterdam. We have received your form and will process it shortly.</p>
      <p><strong>Summary</strong></p>
      <ul>
        <li>Monthly amount: &euro;" . htmlspecialchars($monthlyFormatted, ENT_QUOTES, 'UTF-8') . "</li>
        <li>Authorization period: " . htmlspecialchars($authorizationPeriodLabel, ENT_QUOTES, 'UTF-8') . "</li>
        <li>Starting date: " . htmlspecialchars($startingDate, ENT_QUOTES, 'UTF-8') . "</li>
        <li>Your bank account: " . htmlspecialchars($bankAccount, ENT_QUOTES, 'UTF-8') . "</li>
      </ul>
      <p>If you have questions, contact us at <a href='mailto:{$to}'>{$to}</a> or +31 6 43639999.</p>
      <p>With divine blessings,<br>
      Lord Shiva Hindu Temples Amsterdam<br>
      Hoogoorddreef 79, 1101 BB Amsterdam<br>
      <a href='https://shivatemple.nl'>shivatemple.nl</a></p>
    </div>
  </div>
</body>
</html>";

lsht_send_mail([
    'to' => $email,
    'subject' => $confirmation_subject,
    'html' => $confirmation_body,
]);

$sheet_ok = lsht_append_recurring_donation_to_sheet([
    'submittedAt' => date('c'),
    'salutation' => $salutation,
    'fullName' => $fullName,
    'address' => $address,
    'phone' => $phone,
    'email' => $email,
    'zipCity' => $zipCity,
    'bankAccount' => $bankAccount,
    'monthlyAmount' => $monthlyFormatted,
    'startingDate' => $startingDate,
    'authorizationPeriod' => $authorizationPeriodLabel,
    'signatureDate' => $signatureDate,
    'signature' => $signatureSheet,
    'authorized' => $authorized,
]);

if (!$sheet_ok) {
    error_log('Recurring donation: Google Sheets append failed for ' . $email . ' — ' . lsht_sheets_last_error());
}

if ($mail_sent) {
    $response = [
        'success' => true,
        'message' => 'Thank you! Your authorization has been submitted. A confirmation email has been sent to you.',
    ];
    if (!$sheet_ok) {
        $response['sheetLogged'] = false;
    }
    echo json_encode($response);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not send your form. Please try again or email info@shivatemple.nl directly.']);
}
