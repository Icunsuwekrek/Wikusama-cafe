const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

/**load model of user */
const userModel = require('../models/index').user
async function verifyToken(token) {
    try {
        let secretKey = 'sixnature joss'
        let decode = jwt.verify(token, secretKey)
        return true
    } catch (error) {
        return false
    }
}

exports.authentication = async (request, response) => {
    try {
        /** grab username and password */
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }

        /**check user exis */
        let result = await userModel.findOne(
            {
                where: params
            }
        )

        /**validate result */
        if (result) {
            /**if user has exists, generate token */
            /**define secret key of jwt */
            let secretKey = 'sixnature joss'
            /**define header of jwt */
            let header = {
                algorithm: "HS256" //alogirthm default dari jwt
            }
            /**define payload */
            let payload = JSON.stringify(result)

            /**do generate token using jwt */
            let token = jwt.sign(payload, secretKey, header)

            /**give a response */
            return response.json({
                logged: true,
                status: true,
                token: token,
                message: 'login berhasil',
                data: result
            })
        }

        else {
            /**if user doesn't exist */
            /**give a response */
            return response.json({
                status: false,
                message: 'username atau password tidak cocok'
            })
        }
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async function (request, response, next) {
        try {
            /**grab data header */
            let headers = request.headers.authorization

            /**grab data token 
             * bearer jjnewofnwoign
            */

            let token = headers?.split(" ")[1]
            /**? -> digunakan utk antisipasi jika variabel tsb bernilai null atau undefined 
             * split -> memecah string menjadi array
            */
            if (token == null) {
                return response
                    .status(401)
                    .json({
                        status: false,
                        message: `Unauthorized`
                    })
            }

            /**verify token */
            if (!await verifyToken(token)) {
                return response
                    .status(401)
                    .json({
                        status: false,
                        message: `INVALID TOKEN`
                    })
            }

            /**decrypt token to plain text */
            let plainText = jwt.decode(token)

            /**check allowed roles */
            if (!roles.includes(plainText.role)) {
                return response
                    .status(403)
                    .json({
                        status: false,
                        message: `FORBIDDEN ACCESS`
                    })
            }
            next()

        } catch (error) {
            return response.json({
                status: false,
                message: error.message
            })
        }
    }
}