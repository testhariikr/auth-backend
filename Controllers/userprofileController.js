const User = require("../Models/usermodel");
const jwt=require("jsonwebtoken")

async function checkusr(req){
  
  try{
    const recvtoken = req.headers['acesstoken']
    const decript=jwt.verify(recvtoken,"harii@1234")
    const email=decript.email
    const name=decript.userName
    const user = await User.findOne({userName:name,email:email})
    if(user){
      return user
    }
    else{
      return 0
    }
  }
  catch(e){
    console.log(e)
    return 2
  }
}

async function getUserProfile(req, res) {
  // Implementation for getting user profile
  try{
    const checkusrdta=await checkusr(req)
    if(checkusrdta===2){
      res.json({user:false,error:"cant find in database"})
    }

    else if(checkusrdta){
      res.json({user:true,userData:checkusrdta})
      
    }
  
  }catch(e){
    console.log("someerror"+e)
  }
}

module.exports = {
  getUserProfile,
};
