const io = require("socket.io")(5050,{
    cors: {
        origin: "http://localhost:8000"
    }
});

const rooms = {};
const queue = {};

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("player-fire", data => {
        rooms[data["code"]].playerFireEvent(data);
    });
    socket.on("player-move", data => {
        rooms[data["code"]].playerMoveEvent(data);
    });
    socket.on("join-room", data => {
        socket.join(data);
    });
    socket.on("leave-room", data => {
        console.log("leave-room acquired");
        rooms[data].numberOfPlayers--;
        if(rooms[data].numberOfPlayers == 0){
            rooms[data].closeRoom();
            delete rooms[data];
        }
        socket.leave(data);
    });
});

module.exports = {
    io,
    rooms,
    queue
}
