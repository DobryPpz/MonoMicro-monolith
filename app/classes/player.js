const gamecontrollers = require("../controllers/gamecontrollers");
const socketServer = require("../controllers/socketserver");
const io = socketServer.io;

class Player{
    constructor(hp,armor,x,y,username,skincolor,bulletcolor,shootsound,deathsound,socketid){
        this.hp = hp;
        this.armor = armor;
        this.x = x;
        this.y = y;
        this.username = username;
        this.skincolor = skincolor;
        this.bulletcolor = bulletcolor;
        this.shootsound = shootsound;
        this.deathsound = deathsound;
        this.socketid = socketid;
        this.rotation = 0;
    }
}

module.exports = Player;