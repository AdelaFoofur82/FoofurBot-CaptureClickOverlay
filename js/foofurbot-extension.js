window.FoofurBotExtension = {};
window.FoofurBotExtension.configuration = {};

window.Twitch.ext.configuration.onChanged(() => {
    if (window.Twitch.ext.configuration.broadcaster) {
        window.FoofurBotExtension.configuration = JSON.parse(window.Twitch.ext.configuration.broadcaster.content);
        window.FoofurBotExtension.trigger('onChangedConfiguration', window.FoofurBotExtension.configuration);
    }
});

window.Twitch.ext.onAuthorized((auth) => {
    window.FoofurBotExtension.channelId = auth.channelId;

    const _v = window.Twitch.ext.viewer;
    window.FoofurBotExtension.viewer = {
        id: _v.id,
        opaqueId: _v.opaqueId,
        role: _v.role,
        isLinked: _v.isLinked,
        subscriptionStatus: _v.subscriptionStatus
    };

    window.FoofurBotExtension.trigger('onAuthorized', auth);
});

window.Twitch.ext.onContext((ctx) => {
    if (window.FoofurBotExtension.context) {
        if (window.FoofurBotExtension.context.isFullScreen != ctx.isFullScreen)
            window.FoofurBotExtension.trigger("fullscreenChanged");
        if (window.FoofurBotExtension.context.isMuted != ctx.isMuted)
            window.FoofurBotExtension.trigger("mutedChanged");
        if (window.FoofurBotExtension.context.isPaused != ctx.isPaused)
            window.FoofurBotExtension.trigger("pausedChanged");
        if (window.FoofurBotExtension.context.isTheatreMode != ctx.isTheatreMode)
            window.FoofurBotExtension.trigger("theatreModeChanged");
        if (window.FoofurBotExtension.context.isVideoAdShowing != ctx.isVideoAdShowing)
            window.FoofurBotExtension.trigger("videoAdShowingChanged");
    }

    window.FoofurBotExtension.context = ctx;
    window.FoofurBotExtension.trigger('onContext', ctx);
});

window.FoofurBotExtension._events = $("<div>");

window.FoofurBotExtension.on = function (eventType, handler) {
    window.FoofurBotExtension._events.on(eventType, handler);
};

window.FoofurBotExtension.off = function (eventType, handler) {
    window.FoofurBotExtension._events.off(eventType, handler);
};

window.FoofurBotExtension.one = function (eventType, handler) {
    window.FoofurBotExtension._events.one(eventType, handler);
};

window.FoofurBotExtension.trigger = function (eventType, extraParameters) {
    window.FoofurBotExtension._events.trigger(eventType, extraParameters);
};

window.FoofurBotExtension.send = function (event, data) {
    window.FoofurBotExtension.trigger('send', { provider: 'FoofurBot', event, user: window.FoofurBotExtension.viewer, context: window.FoofurBotExtension.context, data });
};

window.FoofurBotExtension.isMe = function (userData) {
    return userData.opaqueId == window.FoofurBotExtension.viewer.opaqueId;
}

$(() => {

});