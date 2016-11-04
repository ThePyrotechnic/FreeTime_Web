<?php
echo($_FILES);
$total = count($_FILES);
$flag = true;
// Loop through each file

$uid = md5($_SERVER['HTTP_USER_AGENT'] .  $_SERVER['REMOTE_ADDR']);
$filePath = "./uploadFiles/" . $uid;
mkdir($filePath);
for ($i = 0; $i < $total; $i++) {

    // Check file size
    if ($_FILES[$i]['size'] > 32000) { //bytes
        echo "Sorry, your file is too large.";
    } else {
        if (is_uploaded_file($_FILES[$i]['tmp_name'])) {


            $name = md5($_FILES[$i]['name']);
            $name = $name . '.ics';
            $res = move_uploaded_file($_FILES[$i]['tmp_name'], $filePath . '/' . $name);
            $out = print_r(error_get_last(), true);
        }
        else $flag = false;
    }
}
if($flag) {
    $pyscript = './freeTime.py';
    $cmdFilePath = '-d ' . $filePath;
    $command = "python $pyscript $cmdFilePath";
    $ret = [];
    exec($command, $ret, $out);
}
exit;

