// controllers/imageUploaderController.js
const path = require('path');
const imageUploaderService = require('../Service/imageUploder');


async function handleImageUpload(req, res) {
  await imageUploaderService.handleImageUpload(req, res);
}

module.exports = {
  handleImageUpload,
};
