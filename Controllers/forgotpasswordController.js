const User = require("../Models/usermodel");
const emailService=require("../Service/emailService");
const {v4:uuidv4}=require("uuid")

async function forgotPassword(req, res) {
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

  const resetLink = `https://hariiprasathkr.netlify.app/auth/resetpassword/${resetpwdtkn}`;

  text= `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetLink}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
        \n\n\n\n\n
        Team Harii Prasath K R`
  
 
  
  try {
    const sts=await emailService.sendMail(text,user.email)
    if (!sts) {
      console.log(err);
      return res.json({ status: "error", error: "cant send email" });
    }
    res.json({ status: "ok", error: "not send email" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

module.exports = {
  forgotPassword,
};
