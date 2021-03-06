/**
 * Created by Michael on 10/30/2016.
 */
//TODO Help Menu
//TODO Google Calendar integration/Profile upload
//TODO "What can I help you with" shows/hides click text
var file_list = [];
$(window).on('load', function () {
    var start_btn = $('#start_btn');
    var help_btn = $('#help_btn');
    help_btn.css("margin-left", start_btn.outerWidth(true) * 1.5);
    help_btn.css("margin-top", start_btn.outerHeight() - help_btn.outerHeight());
    $(".help_content").hide();
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
                dataType: 'html',
                async: false,
                data: data,
                success: function (data) {
                    var name = (file_name.val() != "") ? file_name.val() : file_name.attr("placeholder");
                    window.location = "./php/dl.php?filename=" + name;
                },
                error: function (data) {
                    //script did not succeed
                }
            });
        }
    });

    $(document).on('click', '.remove_btn', function () {
        var file = $(this).data("file_info");

        file_list = jQuery.grep(file_list, function(value) {
            return value != file;
        });

        $(this).parent().remove();
    });

    $("#help_btn").click(function () {
        var help_section = $('#help');

        if (help_section.css('opacity') == 0) {
            $("html, body").animate({ scrollTop: $("#title_box").offset().top }, 1000);
            help_section.css('opacity', 1);
        }
        else {
            $("html, body").animate({ scrollTop: $("html").offset().top }, 1000);

            help_section.css('opacity', 0);
        }
    });

    $(".help_section").click(function () {
        var help_content = $(this).children("div");

        if (help_content.is(":visible")) {
            help_content.slideUp(250);
        }
        else {
            help_content.slideDown(250);
        }
    });

}); //end jQuery



function displayInfo() {
    var file_picker = document.getElementById("file_input");
    if ('files' in file_picker) {
        if (file_picker.files.length == 0) {
        } else {
            for (var i = 0; i < file_picker.files.length; i++) {
                var file = file_picker.files[i];
                if ('name' in file) {
                    if (!containsObj(file, file_list)) {
                        var name = file.name;
                        if (name.length > 8)
                            name = name.substr(0, 7) + "...";   //TODO organize this
                        var wrapper = document.createElement("div");
                        var element = document.createElement("div");
                        var content = document.createTextNode(name);

                        wrapper.appendChild(element);
                        wrapper.className = "file_wrapper";

                        element.appendChild(content);
                        element.className = "file_obj";

                        var close_btn = document.createElement("div");
                        wrapper.appendChild(close_btn);

                        var matIcon = document.createElement("i");
                        matIcon.appendChild(document.createTextNode("clear"));
                        matIcon.className = "material-icons";

                        close_btn.appendChild(matIcon);
                        close_btn.className = "remove_btn";

                        document.getElementById("bottom").appendChild(wrapper);

                        file_list.push(file);
                        jQuery.data(close_btn, "file_info", file);
                    }
                }
            } //end file loop
            file_picker.value = ""; //resets file picker behind the scenes to allow duplicate uploads after removal
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
