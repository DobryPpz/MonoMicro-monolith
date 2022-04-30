const db = require("./models/index");
const express = require("express");
const app = express();
const path = require("path");
const authRoutes = require("./routes/authroutes");
const scoreRoutes = require("./routes/scoreroutes");
const settingsRoutes = require("./routes/settingsroutes");
const authControllers = require("./controllers/authcontrollers");
const gameControllers = require("./controllers/gamecontrollers");
const scoreControllers = require("./controllers/scorecontrollers");
const settingsControllers = require("./controllers/settingscontrollers");
const authJwt = require("./middleware/authjwt");
require("dotenv").config();
require("ejs");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"views","scripts")));
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.static(path.join(__dirname,"bulletcolors")));
app.use(express.static(path.join(__dirname,"deathsounds")));
app.use(express.static(path.join(__dirname,"shootsounds")));
app.use(express.static(path.join(__dirname,"skincolors")));

db.mongoose.connect("mongodb://localhost/monomicromonolith",() => {
    console.log("connected to a database");
});

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,"views","startpage.html"));
});
app.use("/auth",authRoutes);
app.get("/menu",authJwt.verifyToken,(req,res) => {
    console.log("verified user ",req.user);
    res.sendFile(path.join(__dirname,"views","menupage.html"));
    //res.render("menupage");
});
app.post("/game",authJwt.verifyToken,gameControllers.findGame);
app.use("/score",authJwt.verifyToken,scoreRoutes);
app.use("/setting",authJwt.verifyToken,settingsRoutes);
app.listen(8000,() => {
    console.log("The app is running on port 8000");
});