const db = require("../models/index");
const User = db.user;
const path = require("path");

const getSettings = async (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","settingspage.html"));
}

const saveSettings = async (req,res) => {
    const u = await User.findOne({"username": req.user["username"]});
    u["skincolor"] = req.body["newskincolor"];
    u["bulletcolor"] = req.body["newbulletcolor"];
    u["deathsound"] = req.body["newdeathsound"];
    u["shootsound"] = req.body["newshootsound"];
    await u.save();
    return res.send(u);
}

module.exports = {
    getSettings,
    saveSettings
};