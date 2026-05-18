<?php
/**
 * Contact Form Handler for Hostinger Shared Hosting
 * 
 * This PHP script handles contact form submissions when Node.js is not available.
 * Configure your SMTP settings below or use PHP's mail() function.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? filter_var($input['email'], FILTER_VALIDATE_EMAIL) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$subject = isset($input['subject']) ? trim($input['subject']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';

// Validation
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email, subject, and message are required.']);
    exit;
}

// Email configuration
$to = 'info@shivatemple.nl'; // Change this to your email
$from_email = $email;
$from_name = $name;

// Email to temple
$email_subject = "New Contact Form Submission: " . $subject;
$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>{$name}</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . ($phone ? $phone : 'N/A') . "</div>
            </div>
            <div class='field'>
                <div class='label'>Subject:</div>
                <div class='value'>{$subject}</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: {$from_name} <{$from_email}>" . "\r\n";
$headers .= "Reply-To: {$from_email}" . "\r\n";

// Send email to temple
$mail_sent = mail($to, $email_subject, $email_body, $headers);

// Confirmation email to user
$confirmation_subject = "Confirmation: Your message to Lord Shiva Hindu Temples - " . $subject;
$confirmation_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You for Contacting Us</h2>
        </div>
        <div class='content'>
            <p>Dear {$name},</p>
            <p>Thank you for contacting Lord Shiva Hindu Temples Amsterdam. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <hr>
            <p>With divine blessings,<br>
            The Team at Lord Shiva Hindu Temples Amsterdam<br>
            <a href='https://shivatemple.nl'>shivatemple.nl</a></p>
        </div>
    </div>
</body>
</html>
";

$confirmation_headers = "MIME-Version: 1.0" . "\r\n";
$confirmation_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$confirmation_headers .= "From: Lord Shiva Hindu Temples <{$to}>" . "\r\n";

// Send confirmation email
mail($email, $confirmation_subject, $confirmation_body, $confirmation_headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send message. Please try again.']);
}
?>

