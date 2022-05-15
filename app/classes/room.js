const db = require("../models/index");
const User = db.user;
const socketServer = require("../controllers/socketserver");
const io = socketServer.io;
const rooms = socketServer.rooms;

console.log(io);

class Room{
    constructor(player1,player2,code){
        this.player1 = player1;
        this.player2 = player2;
        this.code = code;
        this.bullets1 = [];
        this.bullets2 = [];
        this.hpAdders = [];
        this.armorAdders = [];
        this.intervalid = undefined;
        this.spawnAddersId = undefined;
        this.numberOfPlayers = 2;
        this.sendUpdateEvent();
    }
    closeRoom = () => {
        clearInterval(this.intervalid);
        clearInterval(this.spawnAddersId);
        delete rooms[this.code];
    }
    declareWinner = async (player) => {
        const u = await User.findOne({username: player});
        u["level"]++;
        await u.save();
    }
    declareLoser = async (player) => {
        const u = await User.findOne({username: player});
        if(u["level"] > 1){
            u["level"]--;
        }
        await u.save();
    }
    playerMoveEvent = (data) => {
        if(data["username"] == this.player1["username"]){
            this.player1.x = data["x"];
            this.player1.y = data["y"];
        }
        if(data["username"] == this.player2["username"]){
            this.player2.x = data["x"];
            this.player2.y = data["y"];
        }
        this.sendUpdateEvent();
    }
    playerFireEvent = (data) => {
        if(data["username"] == this.player1["username"]){
            this.bullets1.push(data["bullet"]);
        }
        if(data["username"] == this.player2["username"]){
            this.bullets2.push(data["bullet"]);
        }
        this.sendUpdateEvent();
    }
    spawnAdder = async () => {
        if(Math.random()<0.5){
            this.hpAdders.push({
                x: 20+Math.floor(Math.random()*600),
                y: 20+Math.floor(Math.random()*500),
                dx: -5+Math.floor(Math.random()*10),
                dy: -5+Math.floor(Math.random()*10) 
            });
        }
        else{
            this.armorAdders.push({
                x: 20+Math.floor(Math.random()*600),
                y: 20+Math.floor(Math.random()*500),
                dx: -5+Math.floor(Math.random()*10),
                dy: -5+Math.floor(Math.random()*10) 
            });
        }
        this.sendUpdateEvent();
    }
    sendUpdateEvent = async () => {
        io.to(this.player1["socketid"]).emit("update",{
            "player1": {
                "x": this.player1.x,
                "y": this.player1.y,
                "hp": this.player1.hp,
                "armor": this.player1.armor,
                "username": this.player1.username,
                "skincolor": this.player1.skincolor,
                "bulletcolor": this.player1.bulletcolor,
                "shootsound": this.player1.shootsound,
                "deathsound": this.player1.deathsound,
                "rotation": this.player1.rotation
            },
            "player2": {
                "x": this.player2.x,
                "y": this.player2.y,
                "hp": this.player2.hp,
                "armor": this.player2.armor,
                "username": this.player2.username,
                "skincolor": this.player2.skincolor,
                "bulletcolor": this.player2.bulletcolor,
                "shootsound": this.player2.shootsound,
                "deathsound": this.player2.deathsound,
                "rotation": this.player2.rotation
            },
            "code": this.code,
            "bullets1": this.bullets1,
            "bullets2": this.bullets2,
            "hpAdders": this.hpAdders,
            "armorAdders": this.armorAdders
        });
        io.to(this.player2["socketid"]).emit("update",{
            "player1": {
                "x": this.player1.x,
                "y": this.player1.y,
                "hp": this.player1.hp,
                "armor": this.player1.armor,
                "username": this.player1.username,
                "skincolor": this.player1.skincolor,
                "bulletcolor": this.player1.bulletcolor,
                "shootsound": this.player1.shootsound,
                "deathsound": this.player1.deathsound,
                "rotation": this.player1.rotation
            },
            "player2": {
                "x": this.player2.x,
                "y": this.player2.y,
                "hp": this.player2.hp,
                "armor": this.player2.armor,
                "username": this.player2.username,
                "skincolor": this.player2.skincolor,
                "bulletcolor": this.player2.bulletcolor,
                "shootsound": this.player2.shootsound,
                "deathsound": this.player2.deathsound,
                "rotation": this.player2.rotation
            },
            "code": this.code,
            "bullets1": this.bullets1,
            "bullets2": this.bullets2,
            "hpAdders": this.hpAdders,
            "armorAdders": this.armorAdders
        });
    }
    update = async () => {
        for(let b of this.bullets1){
            b.x += b.dx;
            b.y += b.dy;
            this.sendUpdateEvent();
        }
        for(let b of this.bullets2){
            b.x += b.dx;
            b.y += b.dy;
            this.sendUpdateEvent();
        }
        for(let h of this.hpAdders){
            if(Math.sqrt((h.x-this.player1.x)**2+(h.y-this.player1.y)**2) <= 40){
                this.player1.hp = Math.min(this.player1.hp+40,500);
                this.hpAdders.splice(this.hpAdders.indexOf(h),1);
                this.sendUpdateEvent();
            }
            if(Math.sqrt((h.x-this.player2.x)**2+(h.y-this.player2.y)**2) <= 40){
                this.player2.hp = Math.min(this.player2.hp+40,500);
                this.hpAdders.splice(this.hpAdders.indexOf(h),1);
                this.sendUpdateEvent();
            }
            if(h.x <= 0){
                h.dx *= -1;
                this.sendUpdateEvent();
            }
            if(h.x >= 800){
                h.dx *= -1;
                this.sendUpdateEvent();
            }
            if(h.y <= 0){
                h.dy *= -1;
                this.sendUpdateEvent();
            }
            if(h.y >= 600){
                h.dy *= -1;
                this.sendUpdateEvent();
            }
        }
        for(let a of this.armorAdders){
            if(Math.sqrt((a.x-this.player1.x)**2+(a.y-this.player1.y)**2) <= 20){
                this.player1.armor = Math.min(this.player1.armor+20,100);
                this.armorAdders.splice(this.armorAdders.indexOf(a),1);
                this.sendUpdateEvent();
            }
            if(Math.sqrt((a.x-this.player2.x)**2+(a.y-this.player2.y)**2) <= 20){
                this.player2.armor = Math.min(this.player2.armor+20,100);
                this.armorAdders.splice(this.armorAdders.indexOf(a),1);
                this.sendUpdateEvent();
            }
            if(a.x <= 0){
                a.dx *= -1;
                this.sendUpdateEvent();
            }
            if(a.x >= 800){
                a.dx *= -1;
                this.sendUpdateEvent();
            }
            if(a.y <= 0){
                a.dy *= -1;
                this.sendUpdateEvent();
            }
            if(a.y >= 600){
                a.dy *= -1;
                this.sendUpdateEvent();
            }
        }
        for(let b of this.bullets1){
            if(Math.sqrt((b.x-this.player2.x)**2+(b.y-this.player2.y)**2) <= 20){
                this.bullets1.splice(this.bullets1.indexOf(b),1);
                if(this.player2.armor >= 10){
                    this.player2.armor -= 10;
                    this.player2.hp -= 10;
                }
                else{
                    this.player2.hp -= (20-this.player2.armor);
                    this.player2.armor = 0;
                }
                this.sendUpdateEvent();
                if(this.player2.hp <= 0){
                    await this.declareWinner(this.player1["username"]);
                    await this.declareLoser(this.player2["username"]);
                    this.closeRoom();
                    io.to(this.player1.socketid).emit("end-game", this.code);
                    io.to(this.player2.socketid).emit("end-game", this.code);
                }
            }
            if(b.x <= 0 || b.x >= 800 || b.y <= 0 || b.y >= 600){
                this.bullets1.splice(this.bullets1.indexOf(b),1);
                this.sendUpdateEvent();
            }
        }
        for(let b of this.bullets2){
            if(Math.sqrt((b.x-this.player1.x)**2+(b.y-this.player1.y)**2) <= 20){
                this.bullets2.splice(this.bullets2.indexOf(b),1);
                if(this.player1.armor >= 10){
                    this.player1.armor -= 10;
                    this.player1.hp -= 10;
                }
                else{
                    this.player1.hp -= (20-this.player1.armor);
                    this.player1.armor = 0;
                }
                this.sendUpdateEvent();
                if(this.player1.hp <= 0){
                    await this.declareWinner(this.player2["username"]);
                    await this.declareLoser(this.player1["username"]);
                    clearInterval(this.intervalid);
                    clearInterval(this.spawnAddersId);
                    delete rooms[this.code];
                    io.to(this.player1.socketid).emit("end-game", this.code);
                    io.to(this.player2.socketid).emit("end-game", this.code);
                }
            }
            if(b.x <= 0 || b.x >= 800 || b.y <= 0 || b.y >= 600){
                this.bullets2.splice(this.bullets2.indexOf(b),1);
                this.sendUpdateEvent();
            }
        }
    }
}

module.exports = Room;