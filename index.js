const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");


const app = express();
app.use(cors());
//mongoose.connect("mongodb://localhost:27017/userdatabyharii");
mongoose.connect("mongodb+srv://testhariikr:d8k1DyhjRoXJKjkC@cluster0.4klbfbz.mongodb.net/userdatabyharii")
app.use(bodyParser.json());

const sequredAauth = require("./Routes/authentication");
const user=require("./Routes/user");
const group =require("./Routes/group");
const imageUploaderController = require('./Controllers/imageUploadController');
app.use('/uploads', express.static('uploads'));
app.post('/upload', imageUploaderController.handleImageUpload);
app.use("/auth", sequredAauth);
app.use("/user",user);
app.use("/group",group);
app.listen(4000);
