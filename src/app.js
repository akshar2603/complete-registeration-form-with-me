require("./db/conn");
const path = require("path");
const express = require("express");
const app = express();
const hbs = require("hbs");
const Register = require("./models/register");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require('./middleware/auth') ;
require("dotenv").config();
// here difference is thatt if we want to insert cookie we use res and cookie and for getting we use cookies function and req objects 
const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");
const temp_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const bcrypt = require("bcrypt");
console.log(static_path);

hbs.registerPartials(partials_path);
console.log(temp_path);
// app.use(express.static(static_path)) ;
app.set("view engine", "hbs"); // here we have use view engine  but for use that we have use res.render
app.set("views", temp_path);
app.use(express.static(static_path));
app.use(express.json());
app.use(cookieParser()) ;
// that we have to require because sending data from html

app.use(express.urlencoded({ extended: false }));

app.post("/register", async (req, res) => {
  try {
    const reg = new Register({
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.mail,
      password: req.body.password,
    });
    console.log(reg); 
    const registered = await reg.save();
    console.log(registered);
    const token = await reg.generateAuthToken();
  //  console.log(token);

    // storing token in cookies
    res.cookie( "jwt", token , {
      httpOnly : true
    } );
    

    
    res.status(201).render("login");
  } catch (err) {
    console.log(err);
  }
});
app.get("/", async (req, res) => {
  try {
    const cookie = req.cookies;

    console.log(cookie);

    if (Object.keys(cookie).length != 0) {
      res.render("login");
    }
    else {
      res.render("index");
    }
  } catch (error) {
    console.log(error);
  }
});
// here auth is my middleware
app.get('/secret', auth , async(req, res) => {
  res.render("secret") ;
} )

app.get("/register", async (req, res) => {
  res.render("register");
});
// for logout 

app.get('/logout', auth, async(req, res) => {
  try{

   // for single user logout 
    // req.user.tokens = req.user.tokens.filter((currEle) => {
    //   return currEle.token !== req.token
    // })
    // res.clearCookie("jwt") ;

    //logout from all device
    req.user.tokens= [] ;

    console.log("logout successfullly done"); 
    await req.user.save() ;
    res.render("index") ;
  }
  catch(err){
    console.log(err) ;
  }
});



// for validation
app.get("/login", async (req, res) => {
  try{
    res.render('login') ;
  }
  catch(err){
    res.send(err); 
  }
})


app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //console.log(email + " " + password) ;
    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);
    //   res.send(useremail) ;
    //   console.log(useremail) ;

    const token = await useremail.generateAuthToken();

    // console.log(isMatch);
    if (isMatch) {
      console.log("rendering home page")
      res.cookie('jwt', token).render("home");
    } 
    else res.render("index");
  } catch (e) {
    console.log("enter valid mail and password");
  }
});
// lets do something awesome here we are doing encryption and decryption to our databases

// in db its in encrypt  for and in our cde we decrypt is

// for that we have bcrypt package take 3 year to decript for haacker

const securePass = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10); // here 10 is for rounds according to our algo takes time for compile and give more security
  const passwordMatch = await bcrypt.compare(password, passwordHash);
  //console.log(passwordHash) ;
  // console.log(passwordMatch);
};
securePass("akshar");

// how its work

// const jwt = require('jsonwebtoken') ;

// const createToken = async() => {
//     const token = await jwt.sign({_id:"66a9282ea8a631b9267b746a"}, "mynameisaksharjogdsgnsofshdfsdofhassdhfhdsifauffi");
//     console.log(token) ; // its give three part second part is your body part

//     const userVer = await jwt.verify(token , "mynameisaksharjogdsgnsofshdfsdofhassdhfhdsifauffi");
//     console.log(userVer) ;
// }
// createToken() ;

app.listen(port, () => {
  console.log(`server is running on  ${port}`);
});

//authentocation atle ak var daroke amaxon ma login karyu atle biji var pacggu no karvu pade amuk log out no karo tya sudhi chene awasome \
// for that we use json web token means server gives use unique token atle a request sathe add j hoi token
