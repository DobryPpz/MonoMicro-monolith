const io = require("socket.io")(5050,{
    cors: {
        origin: "http://localhost:8000"
    }
});

io.on("connection", socket => {
    socket.on("join-room", data => {
        socket.join(data);
    });
    socket.on("leave-room", data => {
        socket.leave(data);
    });
});

module.exports = {
    io
}
