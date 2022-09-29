const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const JWT_SECRET = process.env.SECERET;

const fetchAdmin =(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Invalid auth token"})
    }

    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.admin = data.admin;
        next()
    } catch (error) {
        res.status(401).send({error:"Invalid auth token"})
    }
}

module.exports = fetchAdmin;