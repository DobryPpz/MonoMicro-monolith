const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../models/index");
const User = db.user;

router.get("/", async (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","playerscorepage.html"));
});

router.get("/decreasing", async (req,res) => {
    let users = await User.find({});
    users.sort((a,b) => b["level"]-a["level"]);
    users = users.slice(0,10);
    users = users.map(u => {
        return {
            "username": u["username"],
            "level": u["level"]
        };
    });
    return res.end(JSON.stringify(users));
});

router.get("/increasing",async (req,res) => {
   let users = await User.find({});
   users.sort((a,b) => a["level"]-b["level"]);
   users = users.slice(0,10);
   users = users.map(u => {
       return {
           "username": u["username"],
           "level": u["level"]
       };
   });
   return res.end(JSON.stringify(users));
});

router.get("/player", async (req,res) => {
    let users = await User.find({});
    users.sort((a,b) => b["level"]-a["level"]);
    let player = req.user;
    for(let i=0;i<users.length;i++){
        if(users[i]["username"] == player["username"]){
            return res.end(JSON.stringify({
                "username": player["username"],
                "rank": i+1
            }));
        }
    }
});

module.exports = router;