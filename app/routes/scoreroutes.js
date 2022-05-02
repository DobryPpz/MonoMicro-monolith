const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../models/index");
const User = db.user;

router.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,"..","views","playerscorepage.html"));
});

router.get("/decreasing",(req,res) => {

});

router.get("/increasing",(req,res) => {

});

router.get("/player",(req,res) => {

});

module.exports = router;