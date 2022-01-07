window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    if (configuration.fields.websocket)
        window.FoofurBotExtension.websocket = createWebsocket('wss://' + configuration.fields.websocket);
});

window.FoofurBotExtension.on('send', (event, data) => {
    if (window.FoofurBotExtension.websocket && window.FoofurBotExtension.websocket.isReady())
        window.FoofurBotExtension.websocket.send(data);
});