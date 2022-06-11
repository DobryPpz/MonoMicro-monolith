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
        origin: ["https://monomicro-monolith.azurewebsites.net","http://localhost:8080"],
        methods: ["GET","POST"]
    }
});
socketServer.startServer(io);

require("dotenv").config();
require("ejs");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({
    origin: "https://monomicro-monolith.azurewebsites.net:8080"
}));
app.use(express.static(path.join(__dirname,"..","grafika")));
app.use(express.static(path.join(__dirname,"views","scripts")));
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.static(path.join(__dirname,"bulletcolors")));
app.use(express.static(path.join(__dirname,"deathsounds")));
app.use(express.static(path.join(__dirname,"shootsounds")));
app.use(express.static(path.join(__dirname,"skincolors")));

db.mongoose.connect(process.env.DB_IP,() => {
    console.log("connected to a database");
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
// app.listen(8080,() => {
//     console.log("The app is running on port 8080");
// });