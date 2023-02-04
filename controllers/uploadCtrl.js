const fs = require("fs")
const path = require("path")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../assets/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('video');

const uploadCtrl = {
    uploadVideo: async (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: "Failed to upload video file"
                })
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Video file upload successfully"
                })
            }
        })
    }
}

module.exports = uploadCtrl