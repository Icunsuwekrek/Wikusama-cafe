const express = require(`express`)
const app = express()
const transaksiController = require(`../controllers/transaksi.controller`)
app.use(express.json())

app.post(`/transaksi`,transaksiController.addTransaksi)
app.get(`/transaksi`, transaksiController.getTransaksi)
app.put(`/transaksi/:id_transaksi`,transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`,transaksiController.deleteTransaksi)

module.exports = app
