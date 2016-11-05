<?php
$uid = md5($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
$filePath = "./uploadFiles/" . $uid;
$file = $filePath . '/' . $_GET['filename'] . '.ics';
if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: text/calendar');
    header('Content-Disposition: attachment; filename="' . basename($file) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    ob_flush();
    flush();
    $res = readfile($file);
}

$files = glob($filePath . '/*');
foreach ($files as $cur) {
    if (is_file($cur))
        unlink($cur);
}
rmdir($filePath);
exit;