const User = require("../Models/usermodel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

async function loginUser(req, res) {
  // Implementation for user login
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
}

module.exports = {
  loginUser,
};
