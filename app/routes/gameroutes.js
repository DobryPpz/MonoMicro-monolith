const express = require("express");
const router = express.Router();
const gameControllers = require("../controllers/gamecontrollers");

router.post("/",gameControllers.findGame);

module.exports = router;