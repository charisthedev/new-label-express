const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const videoStreamCtrl = require("../controllers/video-streamingCtrl");

router.post("/:id", auth, videoStreamCtrl.sendVideoUrl);

module.exports = router;
