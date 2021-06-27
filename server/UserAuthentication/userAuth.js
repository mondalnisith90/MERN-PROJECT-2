const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userAuth = async (req, res, next) => {
    //check if the user is a valid user or not
  const jwtToken = req.cookies.userKey;
  try {
      const userId = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      //also check using password of database
      req.userId = userId;
      next();
  } catch (error) {
      res.status(401).json("unauthorized user");
  }

}

module.exports = userAuth;

