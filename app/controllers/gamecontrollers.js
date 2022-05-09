const db = require("../models/index");
const User = db.user;
const Room = require("../classes/room");
const Player = require("../classes/player");
const uniqid = require("uniqid");
const socketServer = require("./socketserver");
const io = socketServer.io;

const rooms = {};
const queue = {};

const createRoom = async (player1,player2) => {
    const roomId = uniqid();
    const player1socket = player1["socketid"];
    const player2socket = player2["socketid"];
    player1 = await User.findOne({
        "username": player1["username"]
    });
    player2 = await User.findOne({
        "username": player2["username"]
    });
    const roomPlayer1 = new Player(500,
        100,
        20+Math.floor(Math.random()*600),
        20+Math.floor(Math.random()*500),
        player1["username"],
        player1["skincolor"],
        player1["bulletcolor"],
        player1["shootsound"],
        player1["deathsound"],
        player1socket);
    const roomPlayer2 = new Player(500,
        100,
        20+Math.floor(Math.random()*600),
        20+Math.floor(Math.random()*500),
        player2["username"],
        player2["skincolor"],
        player2["bulletcolor"],
        player2["shootsound"],
        player2["deathsound"],
        player2socket);
    const gameRoom = new Room(roomPlayer1,roomPlayer2,roomId);
    const interval = setInterval(gameRoom.update,0);
    const spawnInterval = setInterval(gameRoom.spawnAdder,10000);
    gameRoom.intervalid = interval;
    gameRoom.spawnAddersId = spawnInterval;
    rooms[roomId] = gameRoom;
    io.to(player1socket).emit("room-ready",roomId);
    io.to(player2socket).emit("room-ready",roomId);
}

const findPair = async () => {
    for(let q in queue){
        if(queue[q].length >= 2){
            let pair = queue[q].splice(0,2);
            createRoom(pair[0],pair[1]);
        }
    }
}

//requesty
const findGame = async (req,res) => {
    if(!queue.hasOwnProperty(req.body["level"])){
        queue[req.body["level"]] = [];
    }
    let obj = {
        "username": req.body["username"],
        "level": req.body["level"],
        "socketid": req.body["socketid"]
    };
    queue[req.body["level"]].push(obj);
    return res.send({message: "Dodano cię do kolejki oczekiwania na grę"});
}

const declareWinner = async (player) => {
    const u = await User.findOne({username: player});
    u["level"]++;
    await u.save();
}

const declareLoser = async (player) => {
    const u = await User.findOne({username: player});
    if(u["level"] > 1){
        u["level"]--;
    }
    await u.save();
}

setInterval(findPair,0);

module.exports = {
    findGame,
    declareWinner,
    declareLoser,
    rooms,
    queue
}