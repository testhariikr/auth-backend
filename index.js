const express=require("express");
const mongoose=require("mongoose")
const {v4:uuidv4}=require("uuid")
const app=express();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const bodyParser = require('body-parser')
const User=require("./model/usermodel")
const cors=require("cors");
app.use(cors())

const nodemailer=require('nodemailer')
mongoose.connect("mongodb+srv://testhariikr:d8k1DyhjRoXJKjkC@cluster0.4klbfbz.mongodb.net/userdatabyharii")
// mongoose.connect("mongodb://localhost:27017/userdatabyharii")
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testhariikr@gmail.com',
    pass: 'kdej lzeq onsy hdie',
  },
});
async function checkusr(req,res){
  const recvtoken = req.headers['acesstoken']
  try{
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
    res.json({status:"error" , error:"invalidtoken"})
    return 2
  }
}
app.post("/forgotpassword", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.json({
      status: "error",
      error: "this email can't be found in our database",
    });
  }

  const resetpwdtkn = uuidv4();
  console.log(resetpwdtkn);
  user.rstpwdtkn = resetpwdtkn;
  user.rstpwdtknexp = Date.now() + 3600000;
  await user.save();

  const resetLink = `https://hariiprasathkr.netlify.app/resetpassword/${resetpwdtkn}`;
  
  const mailOptions = {
    from: 'testhariikr@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetLink}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
        \n\n\n\n\n
        Team Hari Prasath K R`,
  };
 
  
  try {
    const sts = await transporter.sendMail(mailOptions);
    if (!sts) {
      console.log(err);
      return res.json({ status: "error", error: "cant send email" });
    }
    res.json({ status: "ok", error: "not send email" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

app.get("/",async(req,res)=>{
  
  res.send("hi this is hari")
})
app.post("/resetpassword/:resettoken", async (req, res) => {
  try {
    const recvrsttkn = req.params.resettoken;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.findOne({
      rstpwdtkn: recvrsttkn,
      rstpwdtknexp: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ status: "error", error: "link expired in reset page" });
    }
    user.password = hashpassword;
    user.rstpwdtkn = null;
    user.rstpwdtknexp = null;
    user.updatedAt.date=Date.now()
    user.updatedAt.Description="Password Changed"
    await user.save();
    res.json({ status: "ok", sts: "updated" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

app.post("/userprofile",async (req,res)=>{
  try{
    const checkusrdta=await checkusr(req,res)
    if(checkusrdta===2){
      res.json({user:false,error:"cant find in database"})
    }

    else if(checkusrdta){
      res.json({user:true,fstName:checkusrdta.fstName,userName:checkusrdta.userName,email:checkusrdta.email})
      
    }
  
  }catch(e){
    console.log("someerror"+e)
  }
    
})
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ status: "error", error: "no user found" });
    }

    const passok = await bcrypt.compare(req.body.password, user.password);

    if (passok) {
      const token = jwt.sign(
        { userName: user.userName, email: user.email },
        "harii@1234"
      );
      return res.json({ status: "ok", user: true, token: token });
    }

    return res.json({ status: "error", error: "wrong password" });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({ status: "error", error: "could not verify" });
  }
});
app.post("/register",async (req, res) => {
  const welLink = `https://hariiprasathkr.netlify.app`;
  const welcomemsg = {
    from: 'testhariikr@gmail.com',
    to: req.body.email,
    subject: 'ThankYou... :)',
    text: `Your account has been successfully created...!\n\n
    Please proceed to the website\n\n
        ${welLink}\n\n
        \n\n\n\n\n
        Team Hari Prasath K R`,
  };
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
        
          const sts = await transporter.sendMail(welcomemsg);
          if (!sts) {
            console.log(err);
            return res.json({ status: "error", error: "cant send email" });
          }
          res.json({ status: "ok", error: "not send email" });
      }
      catch(e){
        res.json({status:"error", error:"invalidmail"})
          console.log(e);
      }
    
     
})

app.listen(4000);
