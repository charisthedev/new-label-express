const uploadImage = require("../outliers/upload-files").uploadImage;
const uploadVideo = require("../outliers/upload-files").uploadVideo;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhwwbydrg",
  api_key: "599563973965869",
  api_secret: "W56umDOfiOzsJ3C0S4hvuXUHzmc",
});

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
    const fileBuffer = req.file.buffer;
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          return res.status(500).json({ error: "Upload failed" });
        }
        const imageUrl = result.secure_url;
        res.status(200).json({
          message: "success",
          link: imageUrl,
        });
      })
      .end(fileBuffer);
    // const file = req.file;
    // const folder = "images";
    // const data = await uploadImage(file.buffer, file.originalname, folder);

    // res.json({
    //   message: "success",
    //   link: data,
    // });
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
