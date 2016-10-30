/**
 * Created by Michael on 10/30/2016.
 */
$(document).ready(function() {
    $("#toggle_args").click(function () {
        var middle = $('#middle');

        if ('0px' == middle.css('height')) {
            middle.animate({height: 200}, 800);
        }
        else {
            middle.animate({height: 0}, 800);
        }
    });
});

function displayInfo() {
    var x = document.getElementById("file_input");
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "";
        } else {
            for (var i = 0; i < x.files.length; i++) {
                var file = x.files[i];
                if ('name' in file) {
                    txt += file.name + "<br>";
                }
            }
        }
    }
    else {
        if (x.value == "") {
        } else {
            txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
        }
    }
    document.getElementById("file_info").innerHTML = txt;
}

