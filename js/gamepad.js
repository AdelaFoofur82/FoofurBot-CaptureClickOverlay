window.gamepadAPI = {
    gamepads: [],
    connect(evt) {
        const controllers = window.gamepadAPI.gamepads.map(g => g.controller.id);
        if (!controllers.includes(evt.gamepad.id)) {
            window.gamepadAPI.gamepads.push({
                controller: evt.gamepad,
                id: window.gamepadAPI.gamepads.length,
                update() {
                    // Clear the buttons cache
                    this.buttonsCache = [];

                    // Move the buttons status from the previous frame to the cache
                    for (let k = 0; k < this.buttonsStatus.length; k++) {
                        this.buttonsCache[k] = this.buttonsStatus[k];
                    }

                    // Move the axes status from the previous frame to the cache
                    for (let k = 0; k < this.axesStatus.length; k++) {
                        this.axesCache[k] = this.axesStatus[k];
                    }

                    // Clear the buttons status
                    this.buttonsStatus = [];
                    this.axesStatus = [];

                    // Get the gamepad object
                    var that = this;
                    const c = navigator.getGamepads().filter(c => c && c.id == that.controller.id)[0] || {};

                    let pressed = [];
                    let axes = [];
                    if (!c.connected) return { axes, pressed };

                    // Loop through buttons and push the pressed ones to the array
                    if (c.buttons) {
                        for (let b = 0; b < c.buttons.length; b++) {
                            if (c.buttons[b].pressed) {
                                pressed.push(b);
                            }
                        }
                    }

                    // Loop through axes and push their values to the array
                    if (c.axes) {
                        for (let a = 0; a < c.axes.length; a++) {
                            axes.push({ id: a, value: c.axes[a].toFixed(2) });
                        }
                    }

                    // Assign received values
                    this.axesStatus = axes;
                    this.buttonsStatus = pressed;

                    // Return buttons that already changed
                    pressed = pressed.filter((b) => !this.buttonsCache.includes(b));

                    // Axes that already changed
                    if (this.axesCache.length > 0 && axes.length == this.axesCache.length)
                        axes = axes.filter((a, i) => a.id == this.axesCache[i].id && a.value != this.axesCache[i].value);

                    return { axes, pressed };
                },
                buttonsCache: [],
                buttonsStatus: [],
                axesCache: [],
                axesStatus: []
            });

            console.log(`Gamepad "${evt.gamepad.id}" (${window.gamepadAPI.gamepads.length - 1}) connected.`);
        }
    },
    disconnect(evt) {
        for (var index in window.gamepadAPI.gamepads) {
            if (window.gamepadAPI.gamepads[index].controller == evt.gamepad) {
                console.log(`Gamepad "${evt.gamepad.id}" (${index}) disconnected.`);
                window.gamepadAPI.gamepads.splice(index, 1);
            }
        }
    },
    update(cb) {
        for (var gamepad of window.gamepadAPI.gamepads) {
            const { axes, pressed } = gamepad.update()
            cb(gamepad.id, axes, pressed);
        }
    },
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
};