const express = require('express');
const router = express.Router();
const videoStreamCtrl = require("../controllers/video-streamingCtrl")

router.get("/:file_name/play", videoStreamCtrl.streamVideo)

module.exports = router