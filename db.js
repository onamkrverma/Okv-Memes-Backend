const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const uri = process.env.DATABASE;

const connectToMongo = ()=>{
   mongoose.connect(uri).then(()=>{
    console.log("connection success to database")
   }).catch((err)=>{
    console.log("connection failed")
    console.log(err)
   })

}
module.exports = connectToMongo;