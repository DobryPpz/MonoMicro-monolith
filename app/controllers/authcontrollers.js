const db = require("../models/index");
const User = db.user;
const bcrypt = require("bcrypt");
const authJwt = require("../middleware/authjwt");

const signup = async (req,res) => {
    const u = await User.findOne({username: req.body.username});
    if(u){
        return res.send({message: "Użytkownik o takiej nazwie już istnieje"});
    }
    else{
        const hashedPassword = await bcrypt.hash(req.body.password,8);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            level: 1,
            skincolor: "#FFFFFF",
            bulletcolor: "#FFFFFF",
            deathsound: "deathsounddefault.wav",
            shootsound: "shootsounddefault.wav"
        });
        await user.save();
        return res.send({message: "Zarejestrowano pomyślnie"});
    }
}

const signin = async (req,res) => {
    const u = await User.findOne({username: req.body.username});
    if(u){
        const isPasswordGood = bcrypt.compareSync(req.body.password,u.password);
        if(isPasswordGood){
            return res.send({
                "x-access-token" : authJwt.genToken(u)
            });
        }
        else{
            return res.send({message: "Złe hasło"});
        }
    }
    else{
        return res.send({message: "Nie ma użytkownika o takiej nazwie"});
    }
}

module.exports = {
    signup,
    signin
}