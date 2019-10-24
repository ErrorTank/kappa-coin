


module.exports = (socket, io, utilsContext) => {
    let {db} = utilsContext;
    socket.on("new-block-found", (data, ack) => {
        socket.broadcast.emit("new-block-found", data);

        ack();
    })
};