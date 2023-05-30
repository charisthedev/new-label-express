const crypto = require('crypto')
const uploadObject = require('../outliers/upload-files')
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const VideoUpload = async (req, res) => {
    try {
        const file = req
        const fileName = generateFileName()

        // const data = await uploadObject(file.buffer, fileName)

        console.log(file)

        res.json({
            message: 'message'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = VideoUpload