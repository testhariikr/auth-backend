const User = require("../Models/usermodel");
const GroupData=require("../Models/groupUsers")
const {v4:uuidv4}=require("uuid")
const checkusr=require("./checkUser")
const jwt=require("jsonwebtoken")

async function addUser(req, res) {
    const checkusrdta = await checkusr.checkusr(req, res);
    if(checkusrdta===2){
        return res.json({status: "404", message: "invalid Token"})
    }
    const addingUserName=req.body.userName
    const user = await User.findOne({ userName: addingUserName});
    if (!user) {
        return res.json({ status: "404", message: "no user found" });
    }
    try{
  
    const addgroupuser={
        userName:user.userName,
        email:user.email
      }

    const grpId=req.headers['groupid']
    const groupdta = await GroupData.findOne({ groupId : grpId });
    groupdta.users.push(addgroupuser)
    await groupdta.save();
    const addinguser= await User.findOne({userName:user.userName})
    addinguser.groupName.push({groupId:grpId,groupName:groupdta.groupName})
    addinguser.isAnyGroup=true;
    await addinguser.save();
    res.json({status:"909", message:"sucess",groupData:groupdta.users})
}
      catch(error){
        if (error.code === 11000) {
          res.json({status:"404", message:"user alreay present"})
          console.error("user aready present");
        } else {
          res.json({status:"404", message:"other error"})
          console.error("Error:", error.message);
        }
        
          
      }
}

module.exports = {
    addUser,
};
