const router = require("express").Router()
const uploadCtrl = require("../controllers/uploadCtrl")
const uploadObject= require('../controllers/upload-video')
const fs = require("fs");
const path = require("path");

router.post("/video-upload", uploadCtrl.uploadVideo)


module.exports = router