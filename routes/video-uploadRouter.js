const express = require("express");
const router = express.Router();
const videoUpload = require("../controllers/videoUploadCtrl")
const uploadObject= require('../controllers/upload-files')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/upload-video', upload.single('file'), uploadObject.VideoUpload)
router.post('/upload-image', upload.single('file'), uploadObject.ImageUpload)

module.exports = router