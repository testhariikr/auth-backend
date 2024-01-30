const User=require("../Models/usermodel")
const jwt=require("jsonwebtoken")

async function checkusr(req,res){
  
    try{
      const recvtoken = req.headers['acesstoken']
     ///  console.log(recvtoken)
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
  module.exports = {
    checkusr,
  };