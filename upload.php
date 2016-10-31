<?php
// Count # of uploaded files in array
$_FILES = $_POST['elements'];
$total = count($_FILES['file_input']['name']);

// Loop through each file
for($i=0; $i<$total; $i++) {

    // Check file size
    if ($_FILES['file_input']['size'][$i] > 1) {
        echo "Sorry, your file is too large.";
    }
    else {
        //Get the temp file path
        $tmpFilePath = $_FILES['file_input']['tmp_name'][$i];

        //Make sure we have a filepath
        if ($tmpFilePath != "") {
            //Setup our new file path
            $newFilePath = "./uploadFiles/" . $_FILES['file_input']['name'][$i];

            //Upload the file into the temp dir
            if (move_uploaded_file($tmpFilePath, $newFilePath)) {

                //Handle other code here

            }
        }
    }
}