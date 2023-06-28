const uploadImage = require("../outliers/upload-files").uploadImage;
const uploadVideo = require("../outliers/upload-files").uploadVideo;

const VideoUpload = async (req, res) => {
  try {
    const file = req.file;
    const folder = "videos";
    // const fileSize = req.file.size;

    const data = await uploadVideo(file, folder);
    console.log(data);

    res.status(200).json({
      message: "message",
      link: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const ImageUpload = async (req, res) => {
  try {
    const file = req.file;
    const folder = "images";
    const data = await uploadImage(file.buffer, file.originalname, folder);

    res.json({
      message: "success",
      link: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  VideoUpload,
  ImageUpload,
};
