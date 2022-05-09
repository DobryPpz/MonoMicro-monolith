const gamecontrollers = require("../controllers/gamecontrollers");
const socketServer = require("../controllers/socketserver");
const io = socketServer.io;

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
        io.on("connection", socket => {
            console.log(socket.id);
            socket.on("player-move",data => {
                if(data.code == this.code){
                    if(data["username"] == this.player1["username"]){
                        this.player1.x = data["x"];
                        this.player1.y = data["y"];
                    }
                    if(data["username"] == this.player2["username"]){
                        this.player2.x = data["x"];
                        this.player2.y = data["y"];
                    }
                }
            });
            socket.on("player-rotate", data => {
                if(data.code == this.code){
                    if(data["username"] == this.player1["username"]){
                        this.player1.rotation = data["rotation"];
                    }
                    if(data["username"] == this.player2["username"]){
                        this.player2.rotation = data["rotation"];
                    }
                }
            });
            socket.on("player-fire", data => {
                if(data.code == this.code){
                    if(data["username"] == this.player1["username"]){
                        this.bullets1.push(data["bullet"]);
                    }
                    if(data["username"] == this.player2["username"]){
                        this.bullets2.push(data["bullet"]);
                    }
                }
            });
        });
    }
    async spawnAdder(){
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
    }
    async update(){
        for(let b of this.bullets1){
            b.x += b.dx;
            b.y += b.dy;
        }
        for(let b of this.bullets2){
            b.x += b.dx;
            b.y += b.dy;
        }
        for(let h of this.hpAdders){
            h.x += h.dx;
            h.y += h.dy;
        }
        for(let a of this.armorAdders){
            a.x += a.dx;
            a.y += a.dy;
        }
        for(let h of this.hpAdders){
            if(Math.sqrt((h.x-this.player1.x)**2+(h.y-this.player1.y)**2) <= 20){
                this.player1.hp = Math.min(this.player1.hp+40,500);
            }
            if(Math.sqrt((h.x-this.player2.x)**2+(h.y-this.player2.y)**2) <= 20){
                this.player2.hp = Math.min(this.player2.hp+40,500);
            }
            if(h.x <= 0){
                h.dx *= -1;
            }
            if(h.x >= 800){
                h.dx *= -1;
            }
            if(h.y <= 0){
                h.dy *= -1;
            }
            if(h.y >= 600){
                h.dy *= -1;
            }
        }
        for(let a of this.armorAdders){
            if(Math.sqrt((a.x-this.player1.x)**2+(a.y-this.player1.y)**2) <= 20){
                this.player1.armor = Math.min(this.player1.armor+20,100);
            }
            if(Math.sqrt((a.x-this.player2.x)**2+(a.y-this.player2.y)**2) <= 20){
                this.player2.armor = Math.min(this.player2.armor+20,100);
            }
            if(a.x <= 0){
                a.dx *= -1;
            }
            if(a.x >= 800){
                a.dx *= -1;
            }
            if(a.y <= 0){
                a.dy *= -1;
            }
            if(a.y >= 600){
                a.dy *= -1;
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
                if(this.player2.hp <= 0){
                    await gamecontrollers.declareWinner(this.player1["username"]);
                    await gamecontrollers.declareLoser(this.player2["username"]);
                    clearInterval(this.intervalid);
                    clearInterval(this.spawnAddersId);
                    delete gamecontrollers.rooms[this.code];
                    io.to(this.player1.socketid).emit("end-game", this.code);
                    io.to(this.player2.socketid).emit("end-game", this.code);
                }
            }
            if(b.x <= 0 || b.x >= 800 || b.y <= 0 || b.y >= 600){
                this.bullets1.splice(this.bullets1.indexOf(b),1);
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
                if(this.player1.hp <= 0){
                    await gamecontrollers.declareWinner(this.player2["username"]);
                    await gamecontrollers.declareLoser(this.player1["username"]);
                    clearInterval(this.intervalid);
                    clearInterval(this.spawnAddersId);
                    delete gamecontrollers.rooms[this.code];
                    io.to(this.player1.socketid).emit("end-game", this.code);
                    io.to(this.player2.socketid).emit("end-game", this.code);
                }
            }
            if(b.x <= 0 || b.x >= 800 || b.y <= 0 || b.y >= 600){
                this.bullets2.splice(this.bullets2.indexOf(b),1);
            }
        }
        io.to(this.code).emit("update",{
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
                "socketid": this.player1.socketid,
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
                "socketid": this.player2.socketid,
                "rotation": this.player2.rotation
            },
            "code": this.code,
            "bullets1": this.bullets1,
            "bullets2": this.bullets2,
            "hpAdders": this.hpAdders,
            "armorAdders": this.armorAdders
        });
    }
}

module.exports = Room;