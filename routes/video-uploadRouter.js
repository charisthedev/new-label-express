const express = require("express");
const router = express.Router();
const videoUpload = require("../controllers/videoUploadCtrl")

router.post("/video-upload", videoUpload.uploadFile)

module.exports = router