const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4();
        cb(null, uniqueName + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })
module.exports = upload