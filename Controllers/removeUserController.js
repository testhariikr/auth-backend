const User = require("../Models/usermodel");
const GroupData = require("../Models/groupUsers");
const { v4: uuidv4 } = require("uuid");
const checkusr = require("./checkUser");
const jwt = require("jsonwebtoken");

async function removeUser(req, res) {
  const checkusrdta = await checkusr.checkusr(req, res);
  const grpId = req.headers['groupid'];
  const grpUserId = req.body.removeUserId;

  if (checkusrdta === 2) {
    return res.json({ status: "404", message: "invalid Token" });
  }

  const groupdta = await GroupData.findOne({ groupId: grpId });

  if (!groupdta) {
    return res.json({ status: "404", message: "no group found" });
  }

  try {
    const userIndex = groupdta.users.findIndex(users => users._id.equals(grpUserId));

    if (userIndex === -1) {
      return res.json({ status: "404", message: "no user found in that group" });
    }

    const removingUserName = groupdta.users[userIndex].userName;
    groupdta.users.splice(userIndex, 1);
    await groupdta.save();

    const removingUser = await User.findOne({ userName: removingUserName });

    if (!removingUser) {
      return res.json({ status: "404", message: "no user to remove or already cleared from the database" });
    }

    console.log("Removing User's Group Name:", removingUser.groupName);
    
    const removingUserIndex = removingUser.groupName.findIndex(group => group.groupId === grpId);
    
    console.log("Removing User Index:", removingUserIndex);

    if (removingUserIndex === -1) {
      return res.json({ status: "404", message: "no group to remove or already cleared from the database" });
    }

    removingUser.groupName.splice(removingUserIndex, 1);
    await removingUser.save();

    // Send the success response only after all operations are complete
    return res.json({ status: "909", message: "success" ,groupData:groupdta.users});
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code === 11000) {
      return res.json({ status: "404", message: "user already present" });
    } else {
      return res.json({ status: "404", message: "other error" });
    }
  }
}

module.exports = {
  removeUser,
};
