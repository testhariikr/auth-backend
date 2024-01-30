const express = require('express');
const router = express.Router();
const { createGroup } = require('../Controllers/createGroupController');
const { addUser } = require('../Controllers/adduserController');
const { removeUser} = require('../Controllers/removeUserController');
const {deleteGroup}=require("../Controllers/deleteGroup");
const {getUsers}=require("../Controllers/getGroupData")
const {deleteImageData}=require("../Controllers/deleteImageData")

router.post("/",getUsers);
router.post("/deleteimage",deleteImageData)
router.post("/create", createGroup);
router.post("/adduser", addUser);
router.post("/removeuser", removeUser);
router.post("/delete",deleteGroup);

module.exports = router;