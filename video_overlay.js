const proxyUrl = 'https://proxy.foofurbot.eines.net/?foofurbot-proxy-url=';

window.FoofurBotExtension.CaptureClickOverlay = {};
const CCO = window.FoofurBotExtension.CaptureClickOverlay;
CCO.isDrag = false;

window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    CCO.cursorImage = configuration.fields.cursor_image;
    CCO.cursorImage = CCO.cursorImage.startsWith('https') ? proxyUrl + encodeURIComponent(CCO.cursorImage) : CCO.cursorImage;
    document.querySelector("#foofurbot_captureclickoverlay_css").sheet.cssRules[1].style.setProperty('cursor', `url("${CCO.cursorImage}") 10 10, default`);
    document.createElement("image").setAttribute("src", CCO.cursorImage);

    CCO.clickedImage = configuration.fields.clicked_image;
    CCO.clickedImage = CCO.clickedImage.startsWith('https') ? proxyUrl + encodeURIComponent(CCO.clickedImage) : CCO.clickedImage;
    document.querySelector("#foofurbot_captureclickoverlay_css").sheet.cssRules[2].style.setProperty('cursor', `url("${CCO.clickedImage}") 10 10, default`);
    document.createElement("image").setAttribute("src", CCO.clickedImage);

    CCO.textTimeStep = parseInt(configuration.fields.textTimeStep || CCO.textTimeStep);
    CCO.mousemoveTimeStep = parseInt(configuration.fields.mousemoveTimeStep || CCO.mousemoveTimeStep);
    CCO.keyTooltipShowTime = parseInt(configuration.fields.keyTooltipShowTime || CCO.keyTooltipShowTime);
    CCO.showKeyTooltip = configuration.fields.showKeyTooltip && CCO.showKeyTooltip;

    CCO.tooltipCSS = configuration.fields.tooltipCSS != '' ? configuration.fields.tooltipCSS : CCO.tooltipCSS;
    $('#keytooltip')[0].style = CCO.tooltipCSS;

    CCO.activeEvents = configuration.fields;

    if (navigator.getGamepads && CCO.activeEvents.gamepadPress) {
        window.addEventListener("gamepadconnected", window.gamepadAPI.connect);
        window.addEventListener("gamepaddisconnected", window.gamepadAPI.disconnect);
        setInterval(() => {
            window.gamepadAPI.update((gamepadId, axes, pressed) => {
                for (var b of pressed) {
                    console.log({ gamepad: gamepadId, button: b });
                    window.FoofurBotExtension.send('gamepadPress', { gamepad: gamepadId, button: b });
                    if (CCO.showKeyTooltip)
                        showKeyTooltip(`${gamepadId}:${b}`, true);
                }

                for (var a of axes) {
                    console.log({ gamepad: gamepadId, axis: a.id, value: a.value });
                    window.FoofurBotExtension.send('gamepadAxis', { gamepad: gamepadId, axis: a.id, value: a.value });
                    if (CCO.showKeyTooltip)
                        showKeyTooltip(`${gamepadId}:${a.id}:${a.value}`, true);
                }
            });
        }, 100);
    }
});

CCO.cursorCSS = 'url(img/pointer.png) 10 10, default;';

function getDataFromMouseEvent(e) {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        x: e.originalEvent.x,
        y: e.originalEvent.y,
        percentX: e.originalEvent.x / window.innerWidth,
        percentY: e.originalEvent.y / window.innerHeight,
        button: e.originalEvent.button
    };
}

function getDataFromMouseWheelEvent(e) {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        x: e.x,
        y: e.y,
        percentX: e.x / window.innerWidth,
        percentY: e.y / window.innerHeight,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
        deltaMode: e.deltaMode,
        wheelDelta: e.wheelDelta,
        wheelDeltaX: e.wheelDeltaX,
        wheelDeltaY: e.wheelDeltaY,
    };
}

function getDataFromKeyboardEvent(e) {
    return {
        code: e.originalEvent.code,
        keyCode: e.originalEvent.keyCode,
        key: e.originalEvent.key,
        charCode: e.originalEvent.charCode,
        altKey: e.originalEvent.altKey,
        ctrlKey: e.originalEvent.ctrlKey,
        metaKey: e.originalEvent.metaKey,
        repeat: e.originalEvent.repeat,
        shiftKey: e.originalEvent.shiftKey
    };
}

CCO.tooltipCSS = 'color: white; font-family: sans-serif; text-shadow: 1px 1px black;';
CCO.keyTooltipShowTime = 1000;
CCO.showKeyTooltip = true;
CCO.tooltipTimeout;
CCO.tooltipText = '';
function showKeyTooltip(key, oneStroke = false) {
    CCO.tooltipText += key;
    $('#keytooltip').html(CCO.tooltipText);

    clearTimeout(CCO.tooltipTimeout);

    if (oneStroke) CCO.tooltipText = '';

    CCO.tooltipTimeout = setTimeout(() => {
        CCO.tooltipText = '';
        $('#keytooltip').html('');
    }, CCO.keyTooltipShowTime);
}

CCO.textTimeStep = 500;
CCO.textTimeout;
CCO.text = '';
function captureText(key, cb) {
    CCO.text += key;
    clearTimeout(CCO.textTimeout);
    CCO.textTimeout = setTimeout(() => {
        cb(CCO.text);
        CCO.text = '';
        CCO.tooltipText = '';
    }, CCO.textTimeStep);
}


CCO.mousemoveTimeStep = 200; // time step to capture mousemove events
CCO.mousemoveLastTimeCheck = 0;
function mousemoveTimeSpent(time) {
    if (CCO.mousemoveTimeStep > 0) {
        const now = Date.now();
        if (now - CCO.mousemoveLastTimeCheck > CCO.mousemoveTimeStep) {
            CCO.mousemoveLastTimeCheck = now;
            return true;
        } else {
            return false;
        }
    }
}

$(() => {
    window.Twitch.ext.actions.requestIdShare();

    $("body").on('mousedown', e => {
        if (CCO.activeEvents.mousedown) {
            window.FoofurBotExtension.send('mousedown', getDataFromMouseEvent(e));
            if (CCO.activeEvents.mousedrag)
                CCO.isDrag = true;
            if (e.originalEvent.button != 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

    $("body").on('contextmenu', e => {
        if (CCO.activeEvents.mousedown) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    $("body").on('mouseup', e => {
        if (CCO.activeEvents.mouseup) {
            window.FoofurBotExtension.send('mouseup', getDataFromMouseEvent(e));
            if (CCO.activeEvents.mousedrag)
                CCO.isDrag = false;
        }

        if (CCO.activeEvents.mousedown) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    $("body").on('mousemove', e => {
        if (CCO.activeEvents.mousemove) {
            if (mousemoveTimeSpent()) {
                if (CCO.isDrag)
                    window.FoofurBotExtension.send('mousedrag', getDataFromMouseEvent(e));
                else
                    window.FoofurBotExtension.send('mousemove', getDataFromMouseEvent(e));
            }
        }
    });

    $("body").on('keydown', e => {
        if (CCO.activeEvents.keydown)
            window.FoofurBotExtension.send('keydown', getDataFromKeyboardEvent(e));
    });

    $("body").on('keyup', e => {
        if (CCO.activeEvents.keyup)
            window.FoofurBotExtension.send('keyup', getDataFromKeyboardEvent(e));
    });

    $("body").on('keypress', e => {
        if (CCO.activeEvents.keypress)
            window.FoofurBotExtension.send('keypress', getDataFromKeyboardEvent(e));

        if (CCO.activeEvents.text)
            captureText(e.originalEvent.key, (text) => {
                window.FoofurBotExtension.send('text', { text });
            });

        if (CCO.showKeyTooltip && CCO.activeEvents.text || CCO.activeEvents.keypress)
            showKeyTooltip(e.originalEvent.key, !CCO.activeEvents.text);
    });

    $("body").on("dblclick", e => {
        if (CCO.activeEvents.dblclick) {
            window.FoofurBotExtension.send('dblclick', getDataFromMouseEvent(e));
            e.preventDefault();
            e.stopPropagation();
        } else if (CCO.activeEvents.mousedown) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    document.addEventListener('wheel', e => {
        if (CCO.activeEvents.wheel) {
            window.FoofurBotExtension.send('wheel', getDataFromMouseWheelEvent(e));
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });
});