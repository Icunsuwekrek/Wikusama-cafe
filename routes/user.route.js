const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require (`../controllers/user.controller`)
const {authorization} = require(`../controllers/auth.controller`)

app.post(`/user`, authorization(["admin","kasir", "manajer"]) ,userController.addUser)
app.get(`/user`, authorization(["admin","kasir", "manajer"]) ,userController.getUser)
app.post(`/user/find`, authorization(["admin","kasir", "manajer"]) ,userController.findUser )
app.put(`/user/:id_user`, authorization(["admin","kasir", "manajer"]) ,userController.updateUser)
app.delete(`/user/:id_user`, authorization(["admin","kasir", "manajer"]) ,userController.deleteUser)

module.exports =app