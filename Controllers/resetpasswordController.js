const User = require("../Models/usermodel");

async function resetPassword(req, res) {
  // Implementation for getting user profile
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
}

module.exports = {
  resetPassword,
};
