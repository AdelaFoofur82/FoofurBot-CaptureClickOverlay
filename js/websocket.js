function createWebsocket(url) {
    let obj = {};
    function connectWebSocket(url) {
        obj.connection = new WebSocket(url);

        function heartbeat(ws) {
            clearTimeout(ws.pingTimeout);
            ws.pingTimeout = setTimeout(() => {
                ws.close();
            }, 30000 + 1000);
        }

        const ping = () => heartbeat(obj.connection);
        obj.connection.addEventListener("ping", ping);
        obj.connection.addEventListener("open", ping);

        const close = function (err) {
            setTimeout(function () {
                console.log("reconnecting...");
                connectWebSocket(url);
            }, 1000);
        };
        obj.connection.addEventListener("close", close);

        obj.connection.addEventListener("error", function (err) {
            obj.connection.close();
        });
    }

    try {
        connectWebSocket(url);

        const websocketObject = {
            send: (msg) => {
                if (typeof (msg) == "object") msg = JSON.stringify(msg);
    
                return new Promise((res, rej) => {
                    obj.connection.addEventListener("message", function (e) {
                        res(e.data);
                    });
    
                    obj.connection.send(msg);
    
                    setTimeout(() => {
                        res();
                    }, 5000);
                });
            },
            socket: obj.connection,
            isReady: () => {
                return obj.connection.readyState == obj.connection.OPEN;
            }
        };
    
        return websocketObject;
    } catch (e) {
        return null;
    }
}