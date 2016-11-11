<?php
$servername = "localhost";
$username = "root";
$password = "X.22e5188";
$dbname = "users";

$total = count($_FILES);
$flag = true;
$uid = md5($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
$filePath = "./uploadFiles/" . $uid;
mkdir($filePath);
for ($i = 0; $i < $total; $i++) {

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
    $ret = []; //for debugging
    exec($command, $ret, $out);

    $filePath .= '/' . $_POST['file_name'] . '.ics';
    toDB($ret[sizeof($ret) - 1], $filePath, $uid);
}
exit;

function toDB ($retMessage, $filePath, $uid) {
    $servername = "localhost";
    $username = "root";
    $password = "X.22e5188";
    $dbname = "users";

    if (substr($retMessage, 0, 4) == "Done") {  //python script returned positive
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        $uid= $conn->real_escape_string($uid);
        $filePath = $conn->real_escape_string($filePath);
        $sql = "INSERT INTO userdata (UID, Schedule, PIN)
VALUES ('$uid', '$filePath', NULL)
ON DUPLICATE KEY UPDATE Schedule=VALUES(Schedule)";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
    }
}

function parseTime($time)
{
    $time = str_replace(":", "", $time);
    $pm = (substr($time, strlen($time) - 2) == "pm") ? true : false;
    $time = substr($time, 0, strlen($time) - 2);

    if (strlen($time) == 3 || strlen($time) == 4) {
        if ($pm)
            $time = (int)$time + 1200;
        else if ($time == "1200")   //fix for 12:00 AM
            $time = (int)$time + 1200;
        return $time . "00";
    } else
        return "";  //something is wrong
}

