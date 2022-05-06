const gamecontrollers = require("../controllers/gamecontrollers");
const socketServer = require("../controllers/socketserver");
const io = socketServer.io;

class Room{
    constructor(player1,player2,code){
        this.player1 = player1;
        this.player2 = player2;
        this.code = code;
        this.bullets = [];
        this.hpAdders = [];
        this.armorAdders = [];
        this.intervalid = undefined;
    }
    update(){
        io.to(this.code).emit("update",{
            //wysyłamy do obu członków pokoju wszystkie potrzebne dane
        });
    }
}

module.exports = Room;