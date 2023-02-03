const express = require("express");
const router = express.Router();
const videoUploadController = require("../controllers/videoUploadCtrl")

router.post("/upload", videoUploadController.uploadFile)

module.exports = router