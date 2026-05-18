<?php
/**
 * GoDaddy / SecureServer SMTP (copy to smtp-config.php on the server).
 *
 * Option A — mailbox SMTP (works from your PC; on GoDaddy shared hosting PHP may
 * be blocked from reaching smtpout on port 465). mail-send.php will auto-retry
 * via relay-hosting.secureserver.net:25 when this fails.
 *
 * Option B — relay only (often best on GoDaddy server): set host to
 * relay-hosting.secureserver.net, port 25, encryption 'none', leave username/password empty.
 */
return [
    'enabled' => true,
    'host' => 'smtpout.secureserver.net',
    'port' => 465,
    'encryption' => 'ssl',
    'username' => 'info@shivatemple.nl',
    'password' => 'YOUR_MAILBOX_PASSWORD_HERE',
    'from_email' => 'info@shivatemple.nl',
    'from_name' => 'Lord Shiva Hindu Temples Amsterdam',
    'default_to' => 'info@shivatemple.nl',
];
