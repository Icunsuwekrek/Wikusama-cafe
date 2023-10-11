/**function untuk mengelola request dan memberikan response */

const { request, response } = require("express")

/**memanggil model meja*/
const mejaModel = require(`../models/index`).meja
const joi = require(`joi`)
const validateMeja = async (input) => {
    /**define rules of validation */
    let rules = joi.object().keys({
        nomor_meja: joi.string().required(),
        status: joi.boolean().required()
    })
    let { error } = rules.validate(input)

    if (error) {
        /**merangkai error message of validation */
        let message = error
            .details
            .map(item => item.message)
            .join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return { status: true }
}
/**create and export function to load meja */
exports.getMeja = async (request, response) => {
    try {
        /**call meja from db using model */
        let meja = await mejaModel.findAll()
        //give a response within meja
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and export function to filter available meja */
exports.availableMeja = async (request, response) => {
    try {
        /**grab filter data */
        let param = { status: true }

        /**get data meja from db with defined */
        let meja = await mejaModel.findAll({ where: param })

        /**give response */
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/** create and export function to add new meja */
exports.addMeja = async (request, response) => {
    try {
        /**validasi data */
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status == false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        /**insert data meja to db using model */
        await mejaModel.create(request.body)

        /**give a response to tell that insert has succesed */
        return response.json({
            status: true,
            message: `Data meja berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and export function to update */
exports.updateMeja = async (request, response) => {
    try {
        /**get parameter for update */
        let id_meja = request.params.id_meja

        /**validate data */
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status == false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        /**run update meja using model */
        await mejaModel.update(request.body, {
            where: { id_meja: id_meja }
        })

        /**give response */
        return response.json({
            status: true,
            message: `Data Meja berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create function to delete */
exports.deleteMeja = async (request, response) => {
    try {
        /**get id_meja that will be delete */
        let id_meja = request.params.id_meja

        /**run delete meja using model*/
        await mejaModel.destroy({
            where: { id_meja: id_meja }
        })

        return response.json({
            status: true,
            message: `Data Meja berhasil dihapus`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}