/** load a model of user */
const userModel = require(`../models/index`).user
const joi = require(`joi`)
const { Op } = require("sequelize")
const { request, response } = require("../routes/meja.route")
const md5 = require(`md5`)
/**create a vaidation function */
let validateUser = async (input) => {
    /**make a rules of validation */
    let rules = joi.object().keys({
        nama_user: joi.string().required(),
        role: joi.string().valid(`kasir`, `manajerx`, `admin`),
        username: joi.string().required(),
        password: joi.string().min(4)
    })

    /** process validation */
    let { error } = rules.validate(input)
    /**check error validation */
    if (error) {
        let message = error
            .details
            .map(item => item.message)
            .join(",")

        return {
            status: false,
            message: message
        }
    }
    return {
        status: true
    }
}
/**create function to get all user */
exports.getUser = async (request, response) => {
    try {
        /**get all user using model */
        let result = await userModel.findAll({
            where: { role: 'kasir' }
        })

        /**give a response */
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.getAllUser = async (request, response) => {
    try {
        let result = await userModel.findAll()

        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create function to find user */
exports.findUser = async (request, response) => {
    try {
        /**get the keyword of search */
        let keyword = request.body.keyword
        /**get user based on keyword using model */
        let result = await userModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword },
                }
            }
        })

        /**give a response */
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            error: error.message
        })
    }
}
/** create function to add user */
exports.addUser = async (request, response) => {
    try {
        /**valdate request */
        let resultValidation = validateUser(request.body)
        if (resultValidation.staus === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        /**convert a password to md5 form */
        request.body.password = md5(request.body.password)

        /** execute insert user using model */
        await userModel.create(request.body)

        /**give a response */
        return response.json({
            staus: true,
            message: `data user berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create funtion to update user */
exports.updateUser = async (request, response) => {
    try {
        /**get id user that will be update */
        let id_user = request.params.id_user
        /**validate request body */
        let resultValidation = validateUser(request.body)
        /**cek resultValidation */
        if (resultValidation.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        /**convert password to md5 if exist*/
        if (request.body.password) {
            request.body.password = md5(request.body.password)
        }

        /**execute update user using model */
        await userModel.update(
            request.body,
            { where: { id_user: id_user } }
        )

        /**give a response */
        return response.json({
            status: true,
            message: `Data user telah diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create function to delete user */
exports.deleteUser = async (request, response) => {
    try {
        /**get id user that will be delete */
        let id_user = request.params.id_user
        /**execute delete user using model */
        await userModel.destroy({
            where: { id_user: id_user }
        })
        /**give a response */
        return response.json({
            status: true,
            message: `Data user telah dihapus`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}