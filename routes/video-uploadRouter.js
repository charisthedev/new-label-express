const express = require("express");
const router = express.Router();
const videoUpload = require("../controllers/videoUploadCtrl");
const authAdmin = require("../middleware/authAdmin");
const uploadObject = require("../controllers/upload-files");
const multer = require("multer");
const storage = multer.memoryStorage();
const fileUploadConfig =
  require("../config/file-upload-config").fileUploadConfig;
// const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() }).single("file");

router.post("/video", authAdmin, videoUpload.chunkUpload);
// router.post('/upload-video', upload.single('file'), uploadObject.VideoUpload)
router.post("/image", upload, uploadObject.ImageUpload);

module.exports = router;
