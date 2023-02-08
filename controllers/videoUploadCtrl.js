const path = require("path")
const fileUploadConfig = require("../config/file-upload-config").fileUploadConfig;
const handleDb = require('../db/handle-db')
const multer = require("multer")
const md5 = require("md5")
const fs = require('fs')


const videoUpload = {
    uploadFile: async (req, res) => {
        try {
            var upload = multer(fileUploadConfig).single("user-file")
            upload(req, res, function(uploadError) {
                if (uploadError) {
                    var errorMessage;
                    if(uploadError.code === 'LIMIT_FILE_TYPE') {
                        errorMessage = uploadError.errorMessage;
                    } else if(uploadError.code === 'LIMIT_FILE_SIZE'){
                        errorMessage = 'Maximum file size allowed is ' + process.env.FILE_SIZE + 'MB';
                    }
                    return res.json({
                        error: errorMessage
                    });
                };

                res.json({
                    success: true,
                    link: req.file.path
                });
            });
        } catch (err) {
            res.status(500).json({ msg: err.message})
        }
    },
    chunkUpload: async (req, res) => {
        try {
            const { name, currentChunkIndex, totalChunks } = req.query
            const firstChunk = parseInt(currentChunkIndex) === 0;
            const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
            const ext = name.split('.').pop();
            const data = req.body.toString().split(',')[1];
            const buffer = new Buffer(data, 'base64');
            const tmpFilename = 'tmp_' + md5(name + req.ip) + '.' + ext;
            if (firstChunk && fs.existsSync('./uploads/'+tmpFilename)) {
                fs.unlinkSync('./uploads/'+tmpFilename);
            }
            fs.appendFileSync('./uploads/'+tmpFilename, buffer);
            if (lastChunk) {
                const finalFilename = md5(Date.now()).substr(0, 6) + '.' + ext;
                fs.renameSync('./uploads/'+tmpFilename, './uploads/'+finalFilename);
                res.json({finalFilename});
            } else {
                res.json('ok');
            }
        } catch (err) {
            res.status(500).json({ msg : err.message })
        }
    }
}

module.exports = videoUpload