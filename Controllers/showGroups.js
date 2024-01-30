const User = require("../Models/usermodel");
const GroupData=require("../Models/groupUsers")
const {v4:uuidv4}=require("uuid")
const checkusr=require("./checkUser")
const jwt=require("jsonwebtoken")

async function showGroups(req, res) {
    const checkusrdta = await checkusr.checkusr(req, res);
    if(checkusrdta===2){
        return res.json({status: "404", message: "invalid Token"})
    }
    try{
        res.json({status:"909" , user:true,groupData:checkusrdta.groupName})
    }
    catch(error){
          res.json({status:"404", message:"other error"})
          console.log(error);
        }
        
          
      
}

module.exports = {
    showGroups,
};
