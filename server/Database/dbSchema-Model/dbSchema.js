const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name feild is required'],
        trim: true,
        minlength: [3, 'First name must contain atleast 3 cherecters'],
        maxlength: [15, 'First name must have maximum of 15 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name feild is required'],
        trim: true,
        minlength: [1, 'Last name must contain atleast 3 cherecters'],
        maxlength: [15, 'Last name must have maximum of 15 characters']
    }
    ,
    phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number feild is required'],
        unique: [true, 'This phone number is already exists, try with another number'],
        validate(value){
            if(value.trim().length != 10){
                throw new Error('Phone number length must be 10 digits');
            }
            if(!validator.isMobilePhone(value)){
                throw new Error('This is not a valid phone number');
            }
        },
    },
    
    email: {
        type: String,
        trim: true,
        required: [true, 'Email address feild is required'],
        unique: [true, 'This email address is already exists, try with another one'],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`${value} is not a valid email address`);
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password feild is required']
    },
    messages: {
        type: Array
    },
    jsonwebtokens:{
        type: Array
    },
    date: {
        type: Date,
        default: new Date()
    }
});

//Perform password hashing
UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        try {
            this.password = await bcrypt.hash(this.password, 12);
            next();
        } catch (error) {
            throw new Error(error.message);
        }

    }
});

//Create Json web token here
UserSchema.methods.createJWTToken = async function(){
    try {
        const jwtToken = await jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY);
        //store this jwt token in our database
        this.jsonwebtokens.push(jwtToken);//store jwt token in jsonwebtokens array
        await this.save();
        return jwtToken;
    } catch (error) {
        console.log(error.message);
    }
  
     
}
     



module.exports = UserSchema;