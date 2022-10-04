const express = require('express')
const productosRouter = require('./routes/productos.js')
const app = express()
const bodyParser = require('body-parser')


/* app.set("view engine", "ejs")

app.set("views", __dirname + "/views") */


//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

/* app.use(express.static('src-ejs/public')) */
/* app.use(productosRouter) */




app.listen(8082, ()=>{
    console.log("App started and listening on port 8080 :)")
})




