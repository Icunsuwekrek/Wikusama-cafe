const { where, Op } = require("sequelize")
const detail_transaksi = require("../models/detail_transaksi")
const { request, response } = require("../routes/meja.route")

const transaksiModel = require(`../models/index`).transaksi
const menuModel = require(`../models/index`).menu

/**load model of detail transaksi */
const detailModel = require(`../models/index`).detail_transaksi

/**create and export func to add transaksi */
exports.addTransaksi = async (request, response) => {
    try {
        /** prepare data to add in transaksi */
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: `belum_bayar`
        }

        /**execute add transaksi using model */
        let insertTransaksi = await transaksiModel.create(newTransaksi)

        /**get the latest id of new transaksi */
        let latestID = insertTransaksi.id_transaksi

        /** insert last id in each of detail*/
        let arrDetail = request.body.detail_transaksi

        /** loop each arraydetail to insert last id 
         * and harga
        */
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = latestID

            /** get selected menu based on id_menu */
            let selectedMenu = await menuModel.findOne({ where: { id_menu: arrDetail[i].id_menu } })

            /**add harga in each of detail */
            arrDetail[i].harga = selectedMenu?.harga
        }
        /**execute insert detail transaksi using model */
        await detailModel.bulkCreate(arrDetail)


        /**give a response */
        return response.json({
            status: true,
            message: `Data transaksi telah ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/** create function to edit transaksi */
exports.updateTransaksi = async (request, response) => {
    try {
        /** get id that will be update */
        let id_transaksi = request.params.id_transaksi

        /**prepare data updated transaksi */
        let dataTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        }
        /**execute update transaksi using model */
        await transaksiModel.update(dataTransaksi, { where: { id_transaksi: id_transaksi } })

        /**execute delete all detail of selected transaksi */
        await detailModel.destroy({ where: { id_transaksi: id_transaksi } })
        /**insert a new detail of transaksi */
        /** loop each arraydetail to insert last id 
        * and harga
       */
        let arrDetail = request.body.detail_transaksi
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = id_transaksi

            /** get selected menu based on id_menu */
            let selectedMenu = await menuModel.findOne({ where: { id_menu: arrDetail[i].id_menu } })

            /**add harga in each of detail */
            arrDetail[i].harga = selectedMenu?.harga
        }
        /**insert new detail using model */
        await detailModel.bulkCreate(arrDetail)

        /** give a response */
        return response.json({
            status: true,
            message: `Data transaksi telah diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/** create and export funct to delete transaksi */
exports.deleteTransaksi = async (request, response) => {
    try {
        /**get id transaksi */
        let id_transaksi = request.params.id_transaksi

        /**execute delete detail using model */
        await detailModel.destroy({ where: { id_transaksi: id_transaksi } })
        await transaksiModel.destroy({ where: { id_transaksi: id_transaksi } })

        /**give a response */
        return response.json({
            status: true,
            message: `Data transaksi telah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and export to get all transaksi */
exports.getTransaksi = async (request, response) => {
    try {
        /**get all data using model */
        let result = await transaksiModel.findAll({
            include: [
                "meja",
                "user",
                {
                    model: detailModel,
                    as: "detail_transaksi",
                    include: ["menu"]
                }
            ]
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
exports.findTransaksi = async (request, response) => {
    let keyword = request.body.keyword

    let transaksi = await transaksiModel.findAll({
        where: {
            [Op.or]: [
                { nama_pelanggan: { [Op.substring]: keyword } },
                { id_user: { [Op.like]: `%${keyword}%` } }

            ]
        }
    })
    return response.json({
        success: true,
        data: transaksi,
        message: `Data transaksi berhasil di tampilkan`
    })
}
exports.findTgl = async(req, res) => {
    const{tgl_transaksi} = req.params;
    try {
        const startDate = new Date(tgl_transaksi);
        startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
    
        const endDate = new Date(tgl_transaksi);
        endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999
    
        const result = await transaksiModel.findAll({
          where: {
            tgl_transaksi: {
              [Op.between]: [startDate, endDate],
            },
          },
          include: [
            "meja",
            "user",
            {
              model: detailModel,
              as: "detail_transaksi",
              include: ["menu"],
            },
          ],
        });
    
        if (result.length === 0) {
          res.status(404).json({
            status: "error",
            message: "Data tidak ditemukan",
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "Data ditemukan",
            data: result,
          });
        }
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    
}