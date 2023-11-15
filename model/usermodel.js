const mongoose=require('mongoose');
const user = new mongoose.Schema({
    userName:{type:String,require:true,unique:true},
    fstName:{type:String , requried:true},
    lstName:{type:String},
    email:{type:String ,requried:true,unique:true},
    password:{type:String ,requried:true},
    createdAt:{type:Date ,default:Date.now()},
    rstpwdtkn:{type:String},
    rstpwdtknexp:{type:Date},
    updatedAt:{date:Date,Description:String},
    dob:{type:String}


    }
    ,
    {
        collection:"userData"
    }
)
const model=mongoose.model("userrData",user);
module.exports=model;