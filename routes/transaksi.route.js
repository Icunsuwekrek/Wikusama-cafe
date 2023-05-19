const express = require(`express`)
const app = express()
const transaksiController = require(`../controllers/transaksi.controller`)
const {authorization} = require(`../controllers/auth.controller`)
app.use(express.json())

app.post(`/transaksi`, authorization(["admin","kasir", "manajer"]) ,transaksiController.addTransaksi)
app.get(`/transaksi`, authorization(["admin","kasir", "manajer"]) , transaksiController.getTransaksi)
app.put(`/transaksi/:id_transaksi`, authorization(["admin","kasir", "manajer"]) ,transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, authorization(["admin","kasir", "manajer"]) ,transaksiController.deleteTransaksi)

module.exports = app
