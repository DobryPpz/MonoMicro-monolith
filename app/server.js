const db = require("./models/index");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname,"..","client")));
app.use(express.static(path.join(__dirname,"bulletcolors")));
app.use(express.static(path.join(__dirname,"deathsounds")));
app.use(express.static(path.join(__dirname,"shootsounds")));
app.use(express.static(path.join(__dirname,"skincolors")));

db.mongoose.connect("mongodb://localhost/monomicromonolith",() => {
    console.log("connected to a database");
});

app.listen(8000);