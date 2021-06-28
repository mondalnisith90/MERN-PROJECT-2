const express = require("express");
const router = express.Router();
const User = require("../Database/dbSchema-Model/dbModel");
const bcrypt = require("bcryptjs");
const userAuth = require("../UserAuthentication/userAuth");


router.get("/", async (req, res) => {
    res.status(200).send("Hello from HOME");
});



router.get("/about", (req, res) => {
    res.status(200).send("About page");
});


router.get("/users/data", userAuth,  (req, res) => {
    // console.log(req.email, req.firstName, req.lastName);
    const userData = {firstName: req.firstName, lastName: req.lastName, email: req.email}
    res.status(200).json(userData);
});


router.post("/users/message", userAuth, async (req, res) => {
    try {
        const {firstName, lastName, email, message} = req.body;
        if(!firstName || !lastName || !email || !message){
            res.status(422).json("Please fill the input fields properly");
        }else if(req.email != email.trim()){
            res.status(400).json("Invalid email address. Reason: may be you are a new user or you are login with anthor email address");
        }else{
            //now all ok. Simply store message of this user in database
            const messageObj = {message: message, date:  new Date()};
            const dbResponse = await User.findByIdAndUpdate(req.userId, {$push: {messages: messageObj}});
            if(dbResponse){
                res.status(200).json("Message send successfully.");
            }else{
                res.status(400).json("Message can not send.");
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }

});

//User Registration
router.post("/users/signin", async (req, res) => {
    try{
        const {firstName, lastName, phone, email, password, cpassword} = req.body;
        if(!firstName || !lastName || !phone || !email || !password || !cpassword){
            //input fields not fills properly by user
            res.status(422).json("Please fill the input fields properly");
        }else if(password != cpassword){
            res.status(422).json("password  and confirm password not matched");
        }else{
            //check if this email id already exists in our database or not
            let dbresponse = await User.findOne({email});
            if(dbresponse){
                //email id is already exist in db
                throw new Error("The email address is already exists");
             }
             dbresponse = await User.findOne({phone});
             if(dbresponse){
                 //Phone number already exist in db
                 throw new Error("The phone number is already exists"); 
             }
            //All ok now save this user data to our database
            const newUser = new User({firstName, lastName, phone, email, password});
            //call a middleware pre for password hashing 
            dbresponse = await newUser.save();
            res.status(201).json("User registration successfull");   
        }
    }catch(error){
        res.status(400).json("Failed to register : "+error.message);
    }
});

//User Login
router.post("/users/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            //input fields not fills properly by user
            res.status(422).json("Please fill the input fields properly");
        }else{
            //check user's email and password
            const dbresponse = await User.findOne({email: email});
            if(dbresponse){
                //email address is present in our database
                const isMatched = await bcrypt.compare(password, dbresponse.password); //check both password are same or not using Bcryptjs
                if(isMatched){
                    //Password is matched
                    const jwtToken = await dbresponse.createJWTToken();
                    res.cookie("userKey",jwtToken, {httpOnly: true});
                    res.status(200).json("user login successfull");
                }else{
                    //password is not matched
                    res.status(401).json("Invalid login credentials");
                }

            }else{
               //email address is not present in our database   
               res.status(401).json("Invalid login credentials");
            }
        }
    }catch(error){
        res.status(400).json("User login error");
    }

});












module.exports = router;