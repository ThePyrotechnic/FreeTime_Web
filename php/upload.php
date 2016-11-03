<?php
echo ($_FILES);
$total = count($_FILES);

// Loop through each file
for($i=0; $i<$total; $i++) {

    // Check file size
    if ($_FILES[$i]['size'] > 32000) { //bytes
        echo "Sorry, your file is too large.";
    }
    else {
            $newFilePath = "./uploadFiles/";
            if (is_uploaded_file($_FILES[$i]['tmp_name'])) {
                $name=$_FILES[$i]['name'];
                $res = move_uploaded_file($_FILES[$i]['tmp_name'], $newFilePath . $name);
                $out = print_r(error_get_last(), true);
            }
    }
}