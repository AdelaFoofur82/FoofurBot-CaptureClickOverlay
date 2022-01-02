window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    fillForm(configuration.fields);
});

function fillForm(data) {
    for (var i in data) {
        if (data[i].value == "on")
            $(`[name="${data[i].name}"]`).prop("checked", true);
        else {
            $(`[name="${data[i].name}"]`).val(data[i].value);
        }
    }
}

$(function () {
    $("#config").on("submit", (event) => {
        window.FoofurBotExtension.configuration.fields = $("form#config").serializeArray();
        window.Twitch.ext.configuration.set("broadcaster", "1", JSON.stringify(window.FoofurBotExtension.configuration));
        $("#sent-toast").modal("show");
        event.preventDefault();
    });

    $("#sent-toast").modal();

    hljs.highlightAll();
});