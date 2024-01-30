const User = require("../Models/usermodel");
const GroupData=require("../Models/groupUsers")
const emailService=require("../Service/emailService");
const {v4:uuidv4}=require("uuid")
const checkusr=require("./checkUser")

async function createGroup(req, res) {
    const checkusrdta = await checkusr.checkusr(req, res);
    if(checkusrdta===2){
        return res.json({status: "404", message: "invalid Token"})
    }
  
try{
  const grpName=req.body.groupName;
    const groupId= uuidv4();
   const addmainuser={
    name:checkusrdta.userName,
    email:checkusrdta.email
  }
 
  console.log("ok");
    await GroupData.create ({
        groupName:grpName,
        groupId:groupId,
        groupCreater:addmainuser
    })
console.log("ok");
    const addgroupuser={
        userName:checkusrdta.userName,
        email:checkusrdta.email,
        lastVisited:Date.now(),
        admin:true
      }
      console.log("ok");
    const groupdta = await GroupData.findOne({ groupId: groupId });
      groupdta.users.push(addgroupuser)
      await groupdta.save();
      console.log("ok");
      checkusrdta.groupName.push({groupId:groupId,groupName:grpName})
      console.log("okk");
      checkusrdta.isAnyGroup=true;
      await checkusrdta.save();
      res.json({status:"909", message:"sucess",groupData:checkusrdta.groupName})
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
    createGroup,
};
