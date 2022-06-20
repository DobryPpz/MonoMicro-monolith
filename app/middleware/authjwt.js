const jwt = require("jsonwebtoken");

const genToken = u => {
    const obj = {
        "username": u.username,
        "password": u.password
    };
    const accessToken = jwt.sign(obj,process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
}

const verifyToken = async (req,res,next) => {
    const header = req.headers["x-access-token"];
    if(header !== undefined){
        console.log(header);
        jwt.verify(header,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
            if(err){
                console.log(header);
                console.log(err);
                return res.end(JSON.stringify({message: "You don't have access"}));   
            }
            req.user = user;
            next();
        });
    }
    else{
        return res.end(JSON.stringify({message: "Unauthorized!"}));
    }
}

module.exports = {
    verifyToken,
    genToken
}