const db = require("../models/index");
const Room = require("../classes/room");
const Player = require("../classes/player");
const uniqid = require("uniqid");
const io = require("socket.io")(5050,{
    cors: {
        origin: "http://localhost:8000"
    }
});

const rooms = {};
const queue = {};

io.on("connection",socket => {
    console.log("someone connected with id ",socket.id);
});

const findPair = async () => {
    console.log("szukam pary");
}

const findGame = async (req,res) => {

}

//setInterval(findPair,1000);

module.exports = {
    findGame,
    io
}