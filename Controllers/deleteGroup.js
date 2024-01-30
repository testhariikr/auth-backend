const express = require('express');
const router = express.Router();
const User = require('../Models/usermodel');
const GroupData = require('../Models/groupUsers');
const checkusr = require('./checkUser');
const fs = require('fs');
const rimraf=require("rimraf")

async function deleteGroup(req, res) {
  const checkusrdta = await checkusr.checkusr(req, res);
  if (checkusrdta === 2) {
    return res.json({ status: '404', error: 'invalid Token' });
  }
  try {
    const grpId = req.body.delGrpId;

    console.log(grpId);
    const deletedGroup = await GroupData.findOneAndRemove({ groupId: grpId });

    if (!deletedGroup) {
      return res.json({ status:"404",message: 'Group not found' });
    }

    const users = await User.updateMany( { 'groupName.groupId': grpId }, { $pull: { groupName: { groupId: grpId } } } );
    const checkusrdta = await checkusr.checkusr(req, res);
  

const folderPath = "./uploads/groupsImages/"+grpId;
rimraf.sync(folderPath);
/*fs.rmdir(folderPath, (err) => {
  if (err) {
    console.error('Error deleting folder:', err);
    return;
  }
  console.log('Folder deleted successfully.');
});*/

    return res.json({status:"909", message: 'Group deleted successfully', groupData: checkusrdta.groupName});
  } catch (error) {
    console.error(error);
    return res.json({ status:"404" ,message: 'Internal Server Error' });
  }
}

module.exports = {
  deleteGroup,
};
