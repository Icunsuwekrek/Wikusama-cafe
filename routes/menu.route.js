const express = require(`express`)
const app = express()

/**load controller of menu */
const menuController = require(`../controllers/menu.controller`)

/**create route for add menu*/
app.post(`/menu`,menuController.addMenu)
app.get(`/menu`, menuController.getMenu)
app.post(`/menu/find`, menuController.findMenu)
app.put(`/menu/:id_menu`,menuController.updateMenu)
app.delete(`/menu/:id_menu`,menuController.deleteMenu)

/**export app */
module.exports = app