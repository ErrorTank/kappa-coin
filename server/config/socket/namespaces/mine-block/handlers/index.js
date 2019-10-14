
module.exports = (socket, io, utilsContext) => {
    let {db} = utilsContext;
    socket.on("new-block-found", (data, ack) => {
        console.log(data);
        socket.broadcast.emit("new-block-found", {block: data});
        ack();
    })
};