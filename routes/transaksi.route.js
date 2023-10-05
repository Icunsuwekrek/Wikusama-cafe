const express = require(`express`)
const app = express()
const transaksiController = require(`../controllers/transaksi.controller`)
const {authorization} = require(`../controllers/auth.controller`)
app.use(express.json())

app.post(`/transaksi`, authorization(["kasir"]) ,transaksiController.addTransaksi)
app.get(`/transaksi`, authorization(["admin","kasir", "manajer"]) , transaksiController.getTransaksi)
app.post(`/transaksi/find`,authorization(["admin","kasir", "manajer"]), transaksiController.findTransaksi)
app.post(`/transaksi/findtgl/:tgl_transaksi`, authorization(["admin","kasir","manajer"]), transaksiController.findTgl)
app.put(`/transaksi/:id_transaksi`, authorization(["admin","kasir"]) ,transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, authorization(["admin","kasir", "manajer"]) ,transaksiController.deleteTransaksi)

module.exports = app
