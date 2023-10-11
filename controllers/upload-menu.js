/**load library to upload */
const { date } = require("joi")
const multer = require(`multer`)
const { request } = require("../routes/meja.route")

/**config of storage */
const configStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, `./menu_image`)
    },
    filename: (request, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }

})
/** define function upload*/
const upload = multer({
    storage: configStorage,
    /**file filter */
    fileFilter: (request, file, callback) => {

        /**define accepted extension */
        const extension = [`image/jpg.`, `iamge/png`, `image/jpeg`]

        /**check the extension */
        if (!extension.includes(file.mimetype)) {
            /**refuse upload */
            callback(null, false)
            return callback(null, `invalid type of file`)
        }
        /**filter size limit */
        /**defnie max size */
        const maxSize = (1 * 1024 * 1024)
        const fileSize = request.headers[`content-lenght`]
        if (fileSize > maxSize) {
            /**refuse upload */
            callback(null, false)
            return callback(null, `File size is over`)

        }
        /**accepted upload */
        callback(null, true)

    }
})
/**export function */
module.exports = upload