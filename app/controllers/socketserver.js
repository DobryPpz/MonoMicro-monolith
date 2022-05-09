const io = require("socket.io")(5050,{
    cors: {
        origin: "http://localhost:8000"
    }
});

io.on("connection", socket => {
    socket.on("join-room", data => {
        socket.join(data);
    });
});

module.exports = {
    io
}
