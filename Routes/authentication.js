const express = require('express');
const router = express.Router();
const { loginUser } = require('../Controllers/loginController');
const { createUser } = require('../Controllers/signinController');
const { forgotPassword } = require('../Controllers/forgotpasswordController');
const { resetPassword } = require('../Controllers/resetpasswordController');

router.post("/resetpassword/:resettoken", resetPassword);
router.post("/forgotpassword", forgotPassword);
router.post("/signin", createUser);
router.post("/login", loginUser);

module.exports = router;