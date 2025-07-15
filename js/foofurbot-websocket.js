window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    if (configuration.fields.websocket) {
        document.addEventListener("securitypolicyviolation", (e) => {
            if (e.blockedURI.startsWith("wss")) {
                const websocketURL = 'wss://proxy.foofurbot.eines.net/?foofurbot-proxy-url=' + encodeURIComponent('wss://' + configuration.fields.websocket);
                window.FoofurBotExtension.websocket = createWebsocket(websocketURL);
            }
        });
        window.FoofurBotExtension.websocket = createWebsocket('wss://' + configuration.fields.websocket);
    }
});

window.FoofurBotExtension.on('send', (event, data) => {
    if (window.FoofurBotExtension.websocket && window.FoofurBotExtension.websocket.isReady())
        window.FoofurBotExtension.websocket.send(data);
});

window.FoofurBotExtension.send = function (event, data) {
    window.FoofurBotExtension.trigger('send', {
        provider: 'FoofurBot CaptureClickOverlay',
        event,
        data: {
            user: window.FoofurBotExtension.viewer,
            context: window.FoofurBotExtension.context,
            event_data: data
        }
    });
};