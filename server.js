const express = require(`express`)
const app = express()
/**define port for the server */
const port = 8000

/**load a route of meja */
const mejaRoute = require (`./routes/meja.route`)
const menuRoute = require(`./routes/menu.route`)

/**register route of meja */
app.use(mejaRoute)
app.use(menuRoute)

/**run the server */
app.listen(port, () =>{
    console.log(`server run on port ${port}`);
})