const express = require('express');
const router = express.Router();
const adminData = require('../model/adminSchema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const JWT_SECRET = process.env.SECERET;

// route 1 create admin
router.post('/createadmin', async(req,res)=>{
    try {
        let success = false;
        let admin = await adminData.findOne({email:req.body.email});
        if(admin){
            return res.status(404).json({error:"Email already exist"})
        }
        // convet password into hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt)


        admin = await adminData.create({
            name: req.body.name,
            password:hashPassword,
            email:req.body.email
        })
        // create login token
        const data = {
            admin:{
                id:admin.id
            }
        }
        success = true;
        const authToken = jwt.sign(data,JWT_SECRET);

        res.send(admin)
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('some error occured')
        
    }
})

// route 2 login admin
router.post('/login', async(req,res)=>{
    const {email,password} = req.body
    try {
        let success = false;
        let admin = await adminData.findOne({email:email})
        if(!admin){
            return res.status(400).json({error:"invalid credentials"});
        }
        // compare password
        const comparePass = await bcrypt.compare(password, admin.password)
        if(!comparePass){
            return res.status(400).json({error:"invalid credentials"});
        }
         // create login token
         const data = {
            admin:{
                id:admin.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;

        res.json({success,message:"login success",authToken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send('some error occured')
    }
})

module.exports = router