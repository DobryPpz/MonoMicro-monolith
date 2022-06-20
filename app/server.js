const db = require("./models/index");
const express = require("express");
const app = express();
const server = app.listen(8080);
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authroutes");
const scoreRoutes = require("./routes/scoreroutes");
const settingsRoutes = require("./routes/settingsroutes");
const gameRoutes = require("./routes/gameroutes");
const authJwt = require("./middleware/authjwt");
const User = require("./models/user");
const socketServer = require("./controllers/socketserver");
let io = socketServer.io;
io = require("socket.io")(server,{
    cors: {
        origin: ["http://localhost:8080"],
        methods: ["GET","POST"]
    }
});
socketServer.startServer(io);

require("dotenv").config();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"..","grafika")));
app.use(express.static(path.join(__dirname,"views","scripts")));
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.static(path.join(__dirname,"bulletcolors")));
app.use(express.static(path.join(__dirname,"deathsounds")));
app.use(express.static(path.join(__dirname,"shootsounds")));
app.use(express.static(path.join(__dirname,"skincolors")));

db.mongoose.connect(process.env.DB_IP,() => {
    console.log(`connected to a database on address ${process.env.DB_IP}`);
});

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,"views","startpage.html"));
});
app.get("/menu",authJwt.verifyToken, (req,res) => {
    console.log("verified user ",req.user);
    res.sendFile(path.join(__dirname,"views","menupage.html"));
});
app.use("/auth",authRoutes);
app.use("/game",authJwt.verifyToken,gameRoutes);
app.use("/score",authJwt.verifyToken,scoreRoutes);
app.use("/settings",authJwt.verifyToken,settingsRoutes);