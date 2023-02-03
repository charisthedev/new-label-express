const express = require('express');
const router = express.Router();
const videoStreamController = require("../controllers/video-streamingCtrl")

router.get("/:file_name/play", videoStreamController.streamVideo)

module.exports = router