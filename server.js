const express = require(`express`)
const app = express()
const cors = require(`cors`)
app.use(cors())
/**define port for the server */
const port = 8000

/**load a route of meja */
const mejaRoute = require (`./routes/meja.route`)
const menuRoute = require(`./routes/menu.route`)
const userRoute = require(`./routes/user.route`)
const transaksiRoute = require(`./routes/transaksi.route`)
const authRoute = require('./routes/auth.route')

/**register route of meja */
app.use(mejaRoute)
app.use(menuRoute)
app.use(userRoute)
app.use(transaksiRoute)
app.use(authRoute)
app.use(express.static(__dirname))

/**run the server */
app.listen(port, () =>{
    console.log(`server run on port ${port}`);
})