window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    const data = window.FoofurBotExtension.configuration.fields;

    $("#cursor_image").val(data.cursor_image || 'img/pointer.png');
    $("#clicked_image").val(data.clicked_image || 'img/clicked.png');
    $("#websocket").val(data.websocket);
    $("#mousemoveTimeStep").val(data.mousemoveTimeStep || 200);
    $("#mouseDown").prop('checked', data.mousedown != undefined ? data.mousedown : true);
    $("#mouseUp").prop('checked', data.mouseup != undefined ? data.mouseup : true);
    $("#mouseDblClick").prop('checked', data.dblclick != undefined ? data.dblclick : true);
    $("#mouseWheel").prop('checked', data.wheel != undefined ? data.wheel : true);
    $("#mouseMove").prop('checked', data.mousemove != undefined ? data.mousemove : true);
    $("#mouseDrag").prop('checked', data.mousedrag != undefined ? data.mousedrag : true);
    $("#keyDown").prop('checked', data.keydown != undefined ? data.keydown : true);
    $("#keyUp").prop('checked', data.keyup != undefined ? data.keyup : true);
    $("#keyPress").prop('checked', data.keypress != undefined ? data.keypress : true);
    checkMouseMove();

    $("#showKeyTooltip").prop('checked', data.showKeyTooltip != undefined ? data.showKeyTooltip : true);
    $("#keyTooltipShowTime").val(data.keyTooltipShowTime || 1000);
    $("#tooltipCSS").val(data.tooltipCSS || "color: white; font-family: sans-serif; text-shadow: 1px 1px black;");
    checkTooltip();

    $("#text").prop('checked', data.text != undefined ? data.text : true);
    $("#textTimeStep").val(data.textTimeStep || 500);
    checkText();

    $("#gamepadPress").prop('checked', data.gamepadPress != undefined ? data.gamepadPress : true);
    $("#gamepadPressTimeStep").val(data.gamepadPressTimeStep || 100);
    checkGamepad();
});

function checkMouseMove() {
    if ($("#mouseMove").is(":checked")) {
        $("#mouseDrag").prop('disabled', '');
        $("#mousemoveTimeStep").prop('disabled', '');
    } else {
        $("#mouseDrag").prop('checked', false).prop('disabled', 'disabled');
        $("#mousemoveTimeStep").prop('disabled', 'disabled');
    }
}

function checkTooltip() {
    if ($("#showKeyTooltip").is(":checked")) {
        $("#keyTooltipShowTime").prop('disabled', '');
        $("#tooltipCSS").prop('disabled', '');
    } else {
        $("#keyTooltipShowTime").prop('disabled', 'disabled');
        $("#tooltipCSS").prop('disabled', 'disabled');
    }
}

function checkText() {
    if ($("#text").is(":checked")) {
        $("#textTimeStep").prop('disabled', '');
    } else {
        $("#textTimeStep").prop('disabled', 'disabled');
    }
}

function checkGamepad() {
    if ($("#gamepadPress").is(":checked")) {
        $("#gamepadPressTimeStep").prop('disabled', '');
    } else {
        $("#gamepadPressTimeStep").prop('disabled', 'disabled');
    }
}

function encodeImageFileAsURL(element, defImage) {
    return new Promise((res,rej) => {
        try {
            var file = element.files[0];
            var reader = new FileReader();
            reader.onloadend = function () {
                res(reader.result);
            }
            reader.readAsDataURL(file);
        } catch (e) {
            res(defImage);
        }
    });
}

$(function () {

    $("#mouseMove").on("change", (event) => {
        checkMouseMove();
    });

    $("#showKeyTooltip").on("change", (event) => {
        checkTooltip();
    });

    $("#text").on("change", (event) => {
        checkText();
    });

    $("#gamepadPress").on("change", (event) => {
        checkGamepad();
    });

    $("#config").on("submit", async (event) => {
        event.preventDefault();
        window.FoofurBotExtension.configuration.fields = {
            cursor_image:  $("#cursor_image").val(),
            clicked_image:  $("#clicked_image").val(),
            cursorCSS: $("#cursorCSS").val(),
            websocket: $("#websocket").val(),
            mousemoveTimeStep: $("#mousemoveTimeStep").val(),
            mousedown: $("#mouseDown").is(":checked"),
            mouseup: $("#mouseUp").is(":checked"),
            dblclick: $("#mouseDblClick").is(":checked"),
            wheel: $("#mouseWheel").is(":checked"),
            mousemove: $("#mouseMove").is(":checked"),
            mousedrag: $("#mouseDrag").is(":checked"),
            keydown: $("#keyDown").is(":checked"),
            keyup: $("#keyUp").is(":checked"),
            keypress: $("#keyPress").is(":checked"),
            showKeyTooltip: $("#showKeyTooltip").is(":checked"),
            keyTooltipShowTime: $("#keyTooltipShowTime").val(),
            text: $("#text").is(":checked"),
            textTimeStep: $("#textTimeStep").val(),
            tooltipCSS: $("#tooltipCSS").val(),
            gamepadPress: $("#gamepadPress").is(":checked"),
            gamepadPressTimeStep: $("#gamepadPressTimeStep").val(),
        };
        window.Twitch.ext.configuration.set("broadcaster", "1", JSON.stringify(window.FoofurBotExtension.configuration));
        $("#sent-toast").modal("show");
    });

    $("#sent-toast").modal();
});

