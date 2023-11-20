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
        Team Harii Prasath K R`,
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
async function updateNoteById(userId, noteId, updatedTitle, updatedContent,req,res) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const noteToUpdate = user.notes.find(note => note._id.equals(noteId));

    if (!noteToUpdate) {
      throw new Error('Note not found');
    }

    noteToUpdate.title = updatedTitle;
    noteToUpdate.content = updatedContent;
    noteToUpdate.updatedAt = { date: new Date(), Description: 'Note updated' };

    await user.save();

    console.log('Note updated successfully');
    res.json({ status: "ok", notes: (await checkusr(req,res)).notes});
  } catch (error) {
    console.error('Error updating note:', error.message);
  }
}
async function deleteNoteById(userId, noteId,req,res) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const noteIndex = user.notes.findIndex(note => note._id.equals(noteId));

    if (noteIndex === -1) {
      
      res.json({ status: "error", error:"no notes found" });
      throw new Error('Note not found');
    }

    user.notes.splice(noteIndex, 1);
    await user.save();

    res.json({ status: "ok", msg:"notes  deleted", notes: (await checkusr(req,res)).notes });
    console.log('Note deleted successfully');
    
  } catch (error) {
    console.error('Error deleting note:', error.message);
  }
}
app.post("/upt",async(req,res)=>{
  try {
    const checkusrdta = await checkusr(req, res);
    if (checkusrdta === 2) {
      res.json({ user: false, error: "user can't find in the database" });
    } else if (checkusrdta.notes[0]) {
      updateNoteById(checkusrdta._id,req.body.dataid,req.body.title,req.body.content,req,res)
      
    }
    else{
      res.json({ status: "ok", notes: null});
    }
  } catch (e) {
    console.log("someerror" + e);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
  
})
app.post("/dlt",async(req,res)=>{
  try {
    const checkusrdta = await checkusr(req, res);
    if (checkusrdta === 2) {
      res.json({ user: false, error: "user can't find in the database" });
    } else if (checkusrdta.notes[0]) {
      deleteNoteById(checkusrdta._id,req.body.dataid,req,res)
    }
    else{
      res.json({ status: "ok", notes: null});
    }
  } catch (e) {
    console.log("someerror" + e);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
})
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
app.post("/createnote", async (req, res) => {
  try {
    const checkusrdta = await checkusr(req, res);
    if (checkusrdta === 2) {
      res.json({ user: false, error: "user can't find in the database" });
    } else if (checkusrdta) {
      const title=req.body.title;
      const content= req.body.content;
      const newNote = {
        title:title,
        content:content
      };
      checkusrdta.notes.push(newNote);
      await checkusrdta.save();
      res.json({ status: "ok", notes: (await checkusr(req,res)).notes });
    }
  } catch (e) {
    console.log("someerror" + e);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});
async function getnote(req,res){
  try {
    const checkusrdta = await checkusr(req, res);
    if (checkusrdta === 2) {
      res.json({ user: false, error: "user can't find in the database" });
    } else if (checkusrdta.notes[0]) {
      res.json({ status: "ok", notes: checkusrdta.notes });
    }
    else{
      res.json({ status: "ok", notes: null});
    }
  } catch (e) {
    console.log("someerror" + e);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}
// Get user's notes
app.get("/usernotes", async (req, res) => {
 const ststus=await getnote(req,res)
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
  const instalink='https://www.instagram.com/hariprasath_kr/';
  const welcomemsg = {
    from: 'testhariikr@gmail.com',
    to: req.body.email,
    subject: 'ThankYou... :)',
    text: `Welcome ${req.body.userName}...!\n\n 
    Your account has been successfully created ${req.body.fstName}...!\n\n
    Proceed to the website by cliking the link\n\n
        ${welLink}
        
    Additionally, we'd love for you to stay connected with us! Follow us on Instagram for more updates, behind-the-scenes content, and community highlights. Follow Us on Instagram : ${instalink} 

    Best regards,
        
     Harii Prasath K R 
    hariprasathkrrae@gmail.com`,
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
      catch(error){
        if (error.code === 11000) {
          res.json({status:"error", error:"invalidmail"})
          console.error("Duplicate key error:", error.message);
        } else {
          res.json({status:"error", error:"other error"})
          console.error("Error:", error.message);
        }
        
          
      }
    
     
})
app.post("/sendupdate",async (req, res) => {
  const updateweblink = `https://hariiprasathkr.netlify.app/usernotes`;
  const webname="Harii's Website"
  const instalink='https://www.instagram.com/hariprasath_kr/'
   
  try {
    const users = await User.find();

    // Use Promise.all to send emails concurrently
    await Promise.all(users.map(async (user) => {
      const mailOptions = {
        from: 'testhariikr@gmail.com',
        to: user.email,
        subject: `${user.userName}, New Notes Feature Added to ${webname} `, // Customize subject with user's name
        text: `
        Dear  ${user.userName},

        We trust this message finds you well. We are excited to inform you about a recent update on ${webname} that we think you'll find quite handy.
        
        Introducing the Notes Feature!..${user.fstName}
        
        Now you can:
        
        Add: Jot down thoughts, to-do lists, and important information.
        Edit: Customize your notes to keep them current and organized.
        Delete: Remove any notes that are no longer needed.
        Search: Find specific notes effortlessly.
        Whether it's for work, personal projects, or simply to remember important details, the Notes feature is designed to be a helpful tool.
        
        To access the Notes feature, click on the following link: ${updateweblink}
        
        Additionally, we'd love for you to stay connected with us! Follow us on Instagram for more updates, behind-the-scenes content, and community highlights. Follow Us on Instagram : ${instalink} 
        
        We believe these updates will enhance your experience on ${webname}. Please feel free to share your thoughts and feedback with us.
        
        Thank you for being a valued member of our community!
        
        Best regards,
        
        Harii Prasath K R 
        hariprasathkrrae@gmail.com

        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
      //console.log(mailOptions);
    }));

    res.send('Emails sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
    
     
})

app.listen(4000);
