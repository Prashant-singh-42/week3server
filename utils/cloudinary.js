const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // console.log(localFilePath);
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    console.log("file upload sucessfully", response.url);
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    console.log(error)
    fs.unlinkSync(localFilePath);
    return null;
  }
}

module.exports = {uploadOnCloudinary}