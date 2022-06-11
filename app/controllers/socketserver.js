let io;
const rooms = {};
const queue = {};

const startServer = (IO) => {
    IO.on("connection", socket => {
        console.log("someone connected with id",socket.id);
        socket.on("player-fire", data => {
            if(rooms[data["code"]]) rooms[data["code"]].playerFireEvent(data);
        });
        socket.on("player-move", data => {
            if(rooms[data["code"]]) rooms[data["code"]].playerMoveEvent(data);
        });
        socket.on("join-room", data => {
            socket.join(data);
        });
        socket.on("leave-room", data => {
            console.log("leave-room acquired");
            if(rooms[data]) rooms[data].numberOfPlayers--;
            if(rooms[data] && rooms[data].numberOfPlayers == 0){
                rooms[data].closeRoom();
            }
            socket.leave(data);
        });
        socket.on("hello",data => {
            IO.emit("hi");
        });
        socket.on("disconnect", () => {
            for(r in rooms){
                if(rooms[r].player1.socketid == socket.id || rooms[r].player2.socketid == socket.id){
                    rooms[r].closeRoom();
                }
            }
        });
    });
    io = IO;
}

const getIo = () => {
    return io;
}

const getRooms = () => {
    return rooms;
}

const getQueue = () => {
    return queue;
}

// setInterval(()=>{
//     console.log(rooms);
//     console.log(queue);
// },1000);

module.exports = {
    getIo,
    rooms,
    queue,
    startServer
}