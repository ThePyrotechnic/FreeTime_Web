/**
 * Created by Michael on 10/30/2016.
 */
var file_list = [];
$(window).on('load', function () {
    var start_btn = $('#start_btn');
    var help_btn = $('#help_btn');
    help_btn.css("margin-left", start_btn.outerWidth(true) * 1.75);
    help_btn.css("margin-top", start_btn.outerHeight() - help_btn.outerHeight());
});
$(document).ready(function () {
    var start_time = $('#start_time');
    start_time.attr("placeholder", "7:00am");
    var end_time = $('#end_time');
    end_time.attr("placeholder", "12:00am");
    var buffer = $('#buffer');
    buffer.attr("placeholder", "5");
    $('#min_time').attr("placeholder", "15");
    $('#file_name').attr("placeholder", "freetime");

    start_time.timepicker({'step': 15, 'forceRoundTime': true});
    end_time.timepicker({'step': 15, 'forceRoundTime': true});

    $("#toggle_args").click(function () {
        var middle = $('#middle');

        var toggle = $('#toggle_args');
        if (toggle.text() == 'Edit Preferences')
            toggle.text('Hide Preferences');
        else
            toggle.text('Edit Preferences');

        if ('0px' == middle.css('height')) {
            middle.animate({height: 200}, 500);
        }
        else {
            middle.animate({height: 0}, 500);
        }
    });

    $('#start_btn').click(function () {
        if (file_list.length > 0) {
            var data = new FormData();
            var min_time = $('#min_time');
            var file_name = $('#file_name');
            for (var a = 0; a < file_list.length; a++)
                data.append("" + a, file_list[a]);
            data.append('start_time', (start_time.val() != "") ? start_time.val() : start_time.attr("placeholder"));
            data.append('end_time', (end_time.val() != "") ? end_time.val() : end_time.attr("placeholder"));
            data.append('buffer', (buffer.val() != "") ? buffer.val() : buffer.attr("placeholder"));
            data.append('min_time', (min_time.val() != "") ? min_time.val() : min_time.attr("placeholder"));
            data.append('file_name', (file_name.val() != "") ? file_name.val() : file_name.attr("placeholder"));
            $.ajax({
                type: 'POST',
                url: 'php/upload.php',
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                data: data,
                complete: function () {
                    var name = (file_name.val() != "") ? file_name.val() : file_name.attr("placeholder");
                    window.location = "./php/dl.php?filename=" + name;
                }
            });
        }
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
                        var name = file.name;
                        if(name.length > 8)
                            name = name.substr(0,7) + "...";
                        var element = document.createElement("div");
                        var content = document.createTextNode(name);
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
