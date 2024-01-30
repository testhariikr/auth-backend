const User = require("../Models/usermodel");
const GroupData=require("../Models/groupUsers")
const emailService=require("../Service/emailService");
const {v4:uuidv4}=require("uuid")
const checkusr=require("./checkUser")

async function getUsers(req, res) {
    const checkusrdta = await checkusr.checkusr(req, res);
    if(checkusrdta===2){
        return res.json({status: "404", message: "invalid Token"})
    }
  
try{
  const grpId=req.body.groupId;
   
 
  
    const groupdta = await GroupData.findOne({ groupId: grpId });
      
      res.json({status:"909", message:"sucess",groupData:groupdta})
}
      catch(error){
        if (error.code === 11000) {
          console.log(error);
          res.json({status:"404", message:"user alreay present"})
          console.error("user aready present");
        } else {
          res.json({status:"404", message:"other error"})
          console.error("Error:", error.message);
        }
        
          
      }
}

module.exports = {
   getUsers,
};
