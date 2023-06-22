const express = require("express");
const router = express.Router();
const videoUpload = require("../controllers/videoUploadCtrl");
const authAdmin = require("../middleware/authAdmin");
const uploadObject = require("../controllers/upload-files");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/video", authAdmin, videoUpload.chunkUpload);
// router.post('/upload-video', upload.single('file'), uploadObject.VideoUpload)
router.post("/image", upload.single("file"), uploadObject.ImageUpload);

module.exports = router;
