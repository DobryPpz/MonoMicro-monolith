const mongoose = require("mongoose");

const User = new mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        password: String,
        level: Number,
        skincolor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SkinColor"
        },
        bulletcolor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BulletColor"
        },
        deathsound: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeathSound"
        },
        shootsound: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShootSound"
        }
    })
);

module.exports = User;