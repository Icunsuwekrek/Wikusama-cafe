const express = require(`express`)
const app = express()

/**load controller of menu */
const menuController = require(`../controllers/menu.controller`)
const {authorization} = require(`../controllers/auth.controller`)

/**create route for add menu*/
app.post(`/menu`, authorization(["admin"]) ,menuController.addMenu)
app.get(`/menu`, authorization(["admin","kasir","manajer"]) , menuController.getMenu)
app.post(`/menu/find`, authorization(["admin","kasir"]) , menuController.findMenu)
app.put(`/menu/:id_menu`, authorization(["admin","kasir"]) ,menuController.updateMenu)
app.delete(`/menu/:id_menu`, authorization(["admin","kasir"]) ,menuController.deleteMenu)

/**export app */
module.exports = app