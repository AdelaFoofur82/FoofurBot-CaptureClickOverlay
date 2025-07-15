window.FoofurBotExtension = {};
window.FoofurBotExtension.configuration = {};

window.Twitch.ext.configuration.onChanged(() => {
    if (window.Twitch.ext.configuration.broadcaster) {
        window.FoofurBotExtension.configuration = JSON.parse(window.Twitch.ext.configuration.broadcaster.content);
        window.FoofurBotExtension.trigger('onChangedConfiguration', window.FoofurBotExtension.configuration);
    }
});

function consumeStreamToJson(response) {
    return new Promise((res,rej) => {
        const reader = response.body.getReader();
        res(new ReadableStream({
            start(controller) {
                return pump();
                function pump() {
                    return reader.read().then(({ done, value }) => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                            controller.close();
                            return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                    });
                }
            }
        }));
    }).then(stream => new Response(stream))
    .then(response =>response.json());
}

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

    if (_v.isLinked) {
        fetch(`https://api.twitch.tv/helix/users?id=${_v.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Extension ${auth.helixToken}`,
                'Client-Id': `${auth.clientId}`
            }
        }).then(consumeStreamToJson)
        .then(json => {
            const user = json.data[0];
            window.FoofurBotExtension.viewer = {
                ...window.FoofurBotExtension.viewer, 
                login: user.login,
                display_name: user.display_name,
                profile_image_url: user.profile_image_url
            };
        }).then(() => fetch(`https://api.twitch.tv/helix/users/follows?from_id=${_v.id}&to_id=${auth.channelId}&first=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Extension ${auth.helixToken}`,
                'Client-Id': `${auth.clientId}`
            }}))
        .then(consumeStreamToJson)
        .then(json => {
            window.FoofurBotExtension.viewer.isFollower = json.length == 1;
            window.FoofurBotExtension.trigger('onAuthorized', auth);
        }).catch(e => {
            console.error(e);
        });
    }
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

window.FoofurBotExtension.isMe = function (userData) {
    return userData.opaqueId == window.FoofurBotExtension.viewer.opaqueId;
}