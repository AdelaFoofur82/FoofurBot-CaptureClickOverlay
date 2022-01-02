window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    const fields = configuration.fields;
    for (var i in fields) {
        const value = fields[i].value;
        const field = fields[i].name;
        switch (field) {
            case 'websocket':
                window.FoofurBotExtension.websocket = createWebsocket('wss://' + value);
                break;
        }
    }
});

window.FoofurBotExtension.on('send', (event, data) => {
    if (window.FoofurBotExtension.websocket && window.FoofurBotExtension.websocket.isReady())
        window.FoofurBotExtension.websocket.send(data);
});