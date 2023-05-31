const crypto = require('crypto')
const uploadObject = require('../outliers/upload-files')


const VideoUpload = async (req, res) => {
    try {
        const file = req.file
        const folder = "videos"

        const data = await uploadObject(file.buffer, file.originalname, folder)

        console.log(file)


        res.json({
            message: 'message',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const ImageUpload = async (req, res) => {
    try {
        const file = req.file
        const folder = "images"
        const data = await uploadObject(file.buffer, file.originalname, folder)

        res.json({
            message: 'success',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    VideoUpload,
    ImageUpload
}