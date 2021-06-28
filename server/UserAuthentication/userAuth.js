const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../Database/dbSchema-Model/dbModel");

const userAuth = async (req, res, next) => {
    //check if the user is a valid user or not
  const jwtToken = req.cookies.userKey;
  try {
      const userId = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      //also check this token is present in that user document or not. This will provides more security
      const _id = userId._id;
      const dbResponse = await User.findOne({_id, jsonwebtokens: {$in: [jwtToken]}});
      if(dbResponse){
        req.userId = _id;
        req.email = dbResponse.email;
        req.firstName = dbResponse.firstName;
        req.lastName = dbResponse.lastName;
        next();
      }else{
          throw new Error();
      }
   
  } catch (error) {
      res.status(401).json("unauthorized user. First Login or SignIn.");
  }

}

module.exports = userAuth;

