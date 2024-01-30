const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../Controllers/userprofileController');
const {showGroups}=require("../Controllers/showGroups")

router.post("/", getUserProfile);
router.post("/groups",showGroups)
module.exports = router;
