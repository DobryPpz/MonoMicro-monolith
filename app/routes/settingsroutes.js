const express = require("express");
const router = express.Router();
const settingsControllers = require("../controllers/settingscontrollers");

router.get("/", settingsControllers.getSettings);

router.post("/save", settingsControllers.saveSettings);

module.exports = router;