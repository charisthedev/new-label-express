const router = require("express").Router()
const uploadCtrl = require("../controllers/uploadCtrl")
const uploadObject= require('../controllers/upload-video')
const fs = require("fs");
const path = require("path");

router.post("/video-upload", uploadCtrl.uploadVideo)
router.post('/v-upload', uploadObject)


module.exports = router