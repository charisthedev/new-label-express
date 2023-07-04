const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const videoStreamCtrl = require("../controllers/video-streamingCtrl");

router.get("/:id", auth, videoStreamCtrl.sendVideoUrl);

module.exports = router;
