window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    const data =  window.FoofurBotExtension.configuration.fields;
    $("#websocket").val(data.websocket);
    $("#mousemoveTimeStep").val(data.mousemoveTimeStep);
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
    $("#config").on("submit", async (event) => {
        debugger;
        event.preventDefault();
        window.FoofurBotExtension.configuration.fields =  {
            websocket: $("#websocket").val(),
            mousemoveTimeStep: $("#mousemoveTimeStep").val()
        };
        window.Twitch.ext.configuration.set("broadcaster", "1", JSON.stringify(window.FoofurBotExtension.configuration));
        $("#sent-toast").modal("show");
    });

    $("#sent-toast").modal();

    hljs.highlightAll();
});