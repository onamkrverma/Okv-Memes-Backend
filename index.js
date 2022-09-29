const express = require("express");
const connectToMongo = require("./db");
const app = express();
const cors = require('cors')
const port = 5000;
connectToMongo();

app.use(express.json());
app.use(cors());
//  router 
app.use("/api/memes",require('./router/memesData'));
app.use("/api/auth",require('./router/auth'));

app.listen(port,()=>{
    console.log('app is listening on port ',{port})
})