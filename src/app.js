require('./db/conn');
const path = require('path') ;
const express = require('express'); 
const app = express(); 
const hbs = require('hbs') ;
const Register = require('./models/register') ;

const port = process.env.PORT || 8000 ; 
const static_path = path.join(__dirname, '../public'); 
const temp_path = path.join(__dirname, "../templates/views"); 
const partials_path = path.join(__dirname, "../templates/partials"); 

console.log(static_path)

hbs.registerPartials(partials_path) ;
console.log(temp_path) ;
// app.use(express.static(static_path)) ;
app.set("view engine", "hbs"    ) ; // here we have use view engine  but for use that we have use res.render
app.set("views" , temp_path) ;
app.use(express.static(static_path))
app.use(express.json());
// that we have to require because sending data from html

app.use(express.urlencoded({extended:false}));

app.post('/register', async(req, res) => {
    try{

        const reg =  new Register({ 
        firstname : req.body.fname ,
        lastname: req.body.lname ,
        email : req.body.mail ,
        password :req.body.password
    }) ;

    const registered = await reg.save(); 
    res.status(201).render('index'); 


    }
    catch(err){
        console.log(err);
    }
})
app.get('/', async (req,res) => {
    await res.render("index") ;
    // res.send(result) ;
}) ;
app.get('/register', async (req,res) =>{
    // res.send("ya i am calling") ;
    const { mail, password } = req.query;
    const email = mail ; 

    const fetchmail =  await Register.find({ email } , 'firstname');
    const fetchpassword = await Register.find({ password} , 'firstname');
    // console.log(fetchpassword); 
    // console.log(fetchmail); 
    if(fetchmail.firstname == fetchpassword.firstname){
        res.send("login successful") ;
    }
})
app.listen(port , () =>{
    console.log(`server is running on  ${port}`) ;
})

