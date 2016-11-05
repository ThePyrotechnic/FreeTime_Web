<?php
$total = count($_FILES);
$flag = true;
$uid = md5($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
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
        } else $flag = false;
    }
}
if ($flag) {
    $pyscript = './freeTime.py';
    $arg_FilePath = '-d ' . $filePath;
    $arg_StartTime = '-s ' . parseTime($_POST['start_time']);
    $arg_EndTime = '-e ' . parseTime($_POST['end_time']);
    $arg_Buffer = '-b ' . $_POST['buffer'];
    $arg_MinTime = '-m ' . $_POST['min_time'];
    $arg_FileName = '-n ' . $_POST['file_name'];
    $command = "python $pyscript $arg_FilePath $arg_StartTime $arg_EndTime $arg_Buffer $arg_MinTime $arg_FileName";
    $ret = [];
    exec($command, $ret, $out);
}
exit;

function parseTime($time)
{
    $time = str_replace(":", "", $time);
    $pm = (substr($time, strlen($time) - 2) == "pm") ? true : false;
    $time = substr($time, 0, strlen($time) - 2);

    if (strlen($time) == 3 || strlen($time) == 4) {
        if($pm)
            $time = (int) $time + 1200;
        return $time . "00";
    }
    else
        return "";  //something is wrong
}

