window.FoofurBotExtension.CaptureClickOverlay = {};
const CCO = window.FoofurBotExtension.CaptureClickOverlay;
CCO.isDrag = false;

window.FoofurBotExtension.on('onChangedConfiguration', (event, configuration) => {
    CCO.mousemoveTimeStep = configuration.fields.mousemoveTimeStep || CCO.mousemoveTimeStep;
});

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

CCO.mousemoveTimeStep = 200; // time step to capture mousemove events
CCO.mousemoveLastTimeCheck = 0;
function mousemoveTimeSpent (time) {
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

    $("body").on('click', e => {
        window.FoofurBotExtension.send('click', getDataFromMouseEvent(e));
    });

    $("body").on('mousedown', e => {
        CCO.isDrag = true;
        window.FoofurBotExtension.send('mousedown', getDataFromMouseEvent(e));
    });

    $("body").on('mouseup', e => {
        CCO.isDrag = false;
        window.FoofurBotExtension.send('mouseup', getDataFromMouseEvent(e));
    });

    $("body").on('mousemove', e => {
        if (mousemoveTimeSpent()) {
            if (CCO.isDrag)
                window.FoofurBotExtension.send('mousedrag', getDataFromMouseEvent(e));
            else
                window.FoofurBotExtension.send('mousemove', getDataFromMouseEvent(e));
        }
    });
});