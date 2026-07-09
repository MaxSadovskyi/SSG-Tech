#!/Applications/MAMP/bin/php/php8.3.30/bin/php
<?php
$raw = file_get_contents('php://stdin');
if ($raw === false || $raw === '') exit(0);

$entry = "=== " . date('Y-m-d H:i:s') . " ===\n" . $raw . "\n\n";
file_put_contents('/tmp/ssg-mail.log', $entry, FILE_APPEND);
