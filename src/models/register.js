const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const emloySchema = new mongoose.Schema({
    firstname : {
        type : String, 
        required:true
    }, 
    lastname: {
        type : String, 
        required:true
       
    },
    email :{
        type : String, 
        required:true
        
    },
    password :{
        type : String, 
        required:true
    },
    tokens:[{
        token:{
            type : String, 
            required:true
        }
    }]
})

//generating tokens 

emloySchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id) ;
        const key = process.env.SECRET_KEY ;
        const token = jwt.sign({_id:this._id.toString()}, key);
           
        this.tokens = this.tokens.concat({token:token}) ;

        await this.save() ;
        return token ;
    }
    catch(err){
        console.log(err); 
    }
}

// this is also one type of middleware 


emloySchema.pre("save", async function(next){
    // console.log(`current password is  ${this.password}`) ;
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10) ; 
    } // here check if password is going to be modified or not 
    next() ; // here in our case its a save method next vala piece of code run hojayega 
})


const Register = new mongoose.model("Register", emloySchema) ;

module.exports =  Register;
