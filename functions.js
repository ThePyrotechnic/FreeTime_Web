/**
 * Created by Michael on 10/30/2016.
 */
var file_list = [];

$(document).ready(function () {

    $("#start_time").timepicker({'step': 15, 'forceRoundTime': true});
    $("#end_time").timepicker({'step': 15, 'forceRoundTime': true});
    $("#buffer").timepicker({'step': 1, 'timeFormat': 'i', 'wrapHours': false});

    $("#toggle_args").click(function () {
        var middle = $('#middle');

        var toggle = $('#toggle_args');
        if (toggle.text() == 'Show Preferences')
            toggle.text('Hide Preferences');
        else
            toggle.text('Show Preferences');

        if ('0px' == middle.css('height')) {
            middle.animate({height: 200}, 500);
        }
        else {
            middle.animate({height: 0}, 500);
        }
    });

    $("#start_btn").click(function () {
        var data = new FormData();
        for (var a = 0; a < file_list.length; a++)
            data.append("" + a, file_list[a]);
        $.ajax({
            type: 'POST',
            url: 'php/upload.php',
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            data: data,
            complete: function(data, status) {
                window.location = "./php/dl.php";
            }
        });
    });
});

function displayInfo() {
    var x = document.getElementById("file_input");
    if ('files' in x) {
        if (x.files.length == 0) {
        } else {
            for (var i = 0; i < x.files.length; i++) {
                var file = x.files[i];
                if ('name' in file) {
                    if (!containsObj(file, file_list)) {
                        var element = document.createElement("div")
                        var content = document.createTextNode(file.name);
                        element.appendChild(content);
                        element.className = "file_obj";
                        document.getElementById("bottom").appendChild(element);
                        file_list.push(file);
                    }
                }
            }
        }
    }
    else { /*browser doesn't support Files*/
    }
}

function containsObj(obj, list) {
    for (var a = 0; a < list.length; a++) {
        if (list[a].name == obj.name) {
            return true;
        }
    }
    return false;
}
