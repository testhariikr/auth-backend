const User = require("../Models/usermodel");
const bcrypt=require("bcrypt");
const emailService=require("../Service/emailService");

async function createUser(req, res) {
  const welLink = `https://hariiprasathkr.netlify.app`;
  const instalink='https://www.instagram.com/hariprasath_kr/';
  
  text=`Welcome ${req.body.userName}...!\n\n 
    Your account has been successfully created ${req.body.fstName}...!\n\n
    Proceed to the website by cliking the link\n\n
        ${welLink}
        
    Additionally, we'd love for you to stay connected with us! Follow us on Instagram for more updates, behind-the-scenes content, and community highlights. Follow Us on Instagram : ${instalink} 

    Best regards,
        
     Harii Prasath K R 
    hariprasathkrrae@gmail.com`
    const salt= await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(req.body.password,salt)
      try{
        await User.create({
         userName:req.body.userName,
         email:req.body.email, 
         fstName:req.body.fstName,
         lstName:req.body.lstName,
         password:hashpassword,
        })
        
        const sts=await emailService.sendMail(text,req.body.email)
          if (!sts) {
            console.log(err);
            return res.json({ status: "error", error: "cant send email" });
          }
          res.json({ status: "ok", error: "not send email" });
      }
      catch(error){
        if (error.code === 11000) {
          res.json({status:"error", error:"invalidmail"})
          console.error("Duplicate key error:", error.message);
        } else {
          res.json({status:"error", error:"other error"})
          console.error("Error:", error.message);
        }
        
          
      }
    
}

module.exports = {
  createUser,
};
