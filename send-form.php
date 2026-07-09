<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$recipient_email = 'ig.mosijchuk@gmail.com'; // _to_email — замінити на реальну адресу

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'errors' => ['_form' => 'Only POST allowed']]);
    exit;
}

$name = trim($_POST['user-name-surname'] ?? '');
$mail = trim($_POST['user-mail'] ?? '');
$company = trim($_POST['user-company'] ?? '');
$message = trim($_POST['user-message'] ?? '');

$errors = [];

if ($name === '') {
    $errors['user-name-surname'] = "Ім'я обов'язкове";
} elseif (!preg_match('/^[\p{L}\s]+$/u', $name)) {
    $errors['user-name-surname'] = 'Тільки літери та пробіли';
}

if ($mail === '') {
    $errors['user-mail'] = 'Email обов\'язковий';
} elseif (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/', $mail)) {
    $errors['user-mail'] = 'Некорректний email';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

$subject = '=?UTF-8?B?' . base64_encode('Нова заявка з SSG Tech') . '?=';
$logoBase64 = base64_encode(file_get_contents(__DIR__ . '/logo-email.png'));

$body = '
<!DOCTYPE html>
<html lang="uk">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:google-sans,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="padding:40px 40px 0 40px;text-align:center">
<img src="data:image/png;base64,' . $logoBase64 . '" alt="SSG Tech" style="height:48px;width:auto" />
</td></tr>
<tr><td style="padding:8px 40px 0 40px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#003963">Нова заявка з сайту</h1>
</td></tr>
<tr><td style="padding:24px 40px 32px 40px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;border-bottom:1px solid #e8edf2">
<table width="100%"><tr>
<td style="font-size:13px;font-weight:600;color:#829ac9;width:120px">Ім\'я</td>
<td style="font-size:15px;color:#003963">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</td>
</tr></table>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #e8edf2">
<table width="100%"><tr>
<td style="font-size:13px;font-weight:600;color:#829ac9;width:120px">Email</td>
<td style="font-size:15px;color:#003963">' . htmlspecialchars($mail, ENT_QUOTES, 'UTF-8') . '</td>
</tr></table>
</td></tr>
' . ($company ? '
<tr><td style="padding:12px 0;border-bottom:1px solid #e8edf2">
<table width="100%"><tr>
<td style="font-size:13px;font-weight:600;color:#829ac9;width:120px">Компанія</td>
<td style="font-size:15px;color:#003963">' . htmlspecialchars($company, ENT_QUOTES, 'UTF-8') . '</td>
</tr></table>
</td></tr>
' : '') . '
' . ($message ? '
<tr><td style="padding:12px 0">
<table width="100%"><tr>
<td style="font-size:13px;font-weight:600;color:#829ac9;width:120px;vertical-align:top">Повідомлення</td>
<td style="font-size:15px;color:#003963">' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</td>
</tr></table>
</td></tr>
' : '') . '
</table>
</td></tr>
<tr><td style="padding:20px 40px;background:#f0faff;text-align:center;font-size:12px;color:#829ac9">
SSG Tech &mdash; AI. Automate. Elevate.
</td></tr>
</table>
</td></tr></table>
</body>
</html>';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";
$headers .= "From: SSG Tech <noreply@" . ($_SERVER['HTTP_HOST'] ?? 'ssg-tech.dev') . ">\r\n";
$headers .= "Reply-To: " . $mail . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($recipient_email, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'errors' => ['_form' => 'Помилка відправки. Спробуйте пізніше.']]);
}
