const multer = require('multer');
const path = require('path');
const checkusr = require('../Controllers/checkUser');
const GroupData = require('../Models/groupUsers');
const serverPath = require("../Routes/serverPath");
const fs = require('fs');

async function createFolder(pathh) {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathh, { recursive: true }, (error) => {
      if (error) {
        console.error('Error creating directory:', error);
        reject(error);
      } else {
        console.log('New directory created successfully!');
        resolve();
      }
    });
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgPath); // Use dynamic imgPath here
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

async function handleImageUpload(req, res) {
  console.log("Request Body:", req.body);
  const checkusrdta = await checkusr.checkusr(req, res);
  if (checkusrdta === 2) {
    return res.json({ status: '404', message: 'invalid Token' });
  }
  const grpId = req.headers['groupid']
  if (req.headers['pagelocation'] === "group") {
    await createFolder(("./uploads/groupsImages/" + grpId));
    imgPath = "uploads/groupsImages/" + grpId;
  }
  else if (req.headers['pagelocation'] === "profile") {
    await createFolder("./uploads/profileImages");
    imgPath = "uploads/profileImages";
  }

  const title = req.headers['title']
  const description = req.headers['description']
  upload.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.json({ status: "404", message: 'Multer error.' });
    } else if (err) {
      console.log(err)
      return res.json({ status: "404", message: 'Internal server error.' });
    }

    if (!req.file) {
      return res.json({ status: "404", message: 'No file uploaded.' });
    }

    // Access the uploaded file details
    const fileName = req.file.filename;
    const filePath = req.file.path;
    const imgData = {
      addedBy: checkusrdta.userName,
      title: title,
      description: description,
      imgPath: (serverPath.serverPath() + "/" + filePath.replace(/\\/g, "/"))
    }
    const groupdta = await GroupData.findOne({ groupId: grpId });
    groupdta.images.push(imgData)
    await groupdta.save();
    res.json({ status: "909", message: 'File uploaded successfully', fileName, imageData: groupdta.images, filePath: (serverPath.serverPath() + "/" + filePath.replace(/\\/g, "/")) });
  });
}

module.exports = {
  handleImageUpload,
};
