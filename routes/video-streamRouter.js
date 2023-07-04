const express = require("express");
const router = express.Router();
const videoStreamCtrl = require("../controllers/video-streamingCtrl");

router.get("/:id", videoStreamCtrl.sendVideoUrl);

module.exports = router;
