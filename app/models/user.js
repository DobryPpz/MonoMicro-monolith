const mongoose = require("mongoose");

const User = new mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        password: String,
        level: Number,
        skincolor: String,
        bulletcolor: String,
        deathsound: String,
        shootsound: String
    })
);

module.exports = User;