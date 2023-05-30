const express = require("express");
const router = express.Router();
const videoUpload = require("../controllers/videoUploadCtrl")
const uploadObject= require('../controllers/upload-video')

router.post("/video-upload", videoUpload.chunkUpload)
router.post('/v-upload', uploadObject)

module.exports = router