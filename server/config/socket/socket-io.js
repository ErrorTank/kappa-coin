

const appNamespaces = [
    {
        key: "poolTracker",
        path: "/pending-transaction",
        onConnect: (socket, context) => {
            console.log(socket.id + " is connect to /pending-transaction")
        },
        onDisconnect: (socket, context) => {
            console.log(socket.id + " is disconnect to /pending-transaction")
        },
        handlers: "./namespaces/pending-transaction/handlers/index"
    },
    {
        key: "chainTracker",
        path: "/mine-block",
        onConnect: (socket, context) => {
            console.log(socket.id + " is connect to /mine-block")
        },
        onDisconnect: (socket, context) => {
            console.log(socket.id + " is disconnect to /mine-block")
        },
        handlers: "./namespaces/mine-block/handlers/index"
    },
];

const configIO = (nspIO, context) => {
    nspIO.io.on('connection', function (socket) {
        nspIO.onConnect(socket, context);
        socket.on("disconnect", function () {
            nspIO.onDisconnect(socket, context);
        });
        require(nspIO.handlers)(socket, nspIO.io, context);
    });
    return nspIO.io;
};

const createNamespaceIO = (server, context) => {
    const io = require('socket.io')(server);
    const namespacesIO = appNamespaces.map(({path, onConnect, onDisconnect, handlers, key}) => ({
        io: io.of(path),
        onConnect,
        onDisconnect,
        handlers,
        key
    }));

    return namespacesIO.reduce((result, cur) => {
        result[cur.key] = configIO(cur, context);
        return result;
    }, {})
};

module.exports = {createNamespaceIO};

