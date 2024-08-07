const jwt = require("jsonwebtoken");
const Register = require("../models/register");

// next call no kariye to a function ni bar j no jai tyaj latki jai atle call karvu j pade
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verifyUser) ;
    const user = await Register.findOne({ _id: verifyUser._id });

    console.log(user);
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.send(err);
  }
};

module.exports = auth;
