const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require (`../controllers/user.controller`)
const {authorization} = require(`../controllers/auth.controller`)

app.post(`/user/kasir`, authorization(["admin","kasir"]) ,userController.addUser)
app.get(`/user`, authorization(["admin","kasir","manajer"]), userController.getAllUser)
app.get(`/user/kasir`, authorization(["admin","kasir","manajer"]) ,userController.getUser)
app.post(`/user/find`, authorization(["admin","kasir"]) ,userController.findUser )
app.put(`/user/:id_user`, authorization(["admin","kasir"]) ,userController.updateUser)
app.delete(`/user/:id_user`, authorization(["admin","kasir"]) ,userController.deleteUser)

module.exports =app