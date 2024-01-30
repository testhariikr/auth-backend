const User = require("../Models/usermodel");
const GroupData = require("../Models/groupUsers");
const { v4: uuidv4 } = require("uuid");
const checkusr = require("./checkUser");
const jwt = require("jsonwebtoken");
const fs = require('fs');

async function deleteImageData(req, res) {
  const checkusrdta = await checkusr.checkusr(req, res);
  const grpId = req.headers['groupid'];
  const imgId = req.body.imageId;

  if (checkusrdta === 2) {
    return res.json({ status: "404", message: "invalid Token" });
  }

  const groupdta = await GroupData.findOne({ groupId: grpId });

  if (!groupdta) {
    return res.json({ status: "404", message: "no group found" });
  }
  try {
    const imageIndex = groupdta.images.findIndex(images => images._id.equals(imgId));

    if (imageIndex === -1) {
      return res.json({ status: "404", message: "no image found in that group" });
    }
    const removingImagePath = groupdta.images[imageIndex].imgPath;
    groupdta.images.splice(imageIndex, 1);
    await groupdta.save();
    const parsedUrl = new URL(removingImagePath);
    const imagePath = parsedUrl.pathname;
    const cleanedImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    fs.unlink(cleanedImagePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully.');
      });
    // Send the success response only after all operations are complete
    return res.json({ status: "909", message: "success" ,groupData:groupdta.images});
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code === 11000) {
      return res.json({ status: "404", message: "image already present" });
    } else {
      return res.json({ status: "404", message: "other error" });
    }
  }
}

module.exports = {
  deleteImageData,
};
