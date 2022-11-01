const express = require('express')
const { Server: HttpServer } = require('http')


const productosRouter = require('./routes/productos.js')
const carritoRouter = require('./routes/carrito.js')


const app = express()
const httpServer = new HttpServer(app)
const bodyParser = require('body-parser')


//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)


// Handleo todo lo no implementado aca
app.all("*", (req, res) => {
    res.status(404)
    res.end(JSON.stringify({
        error: -2,
        descripcion: `ruta ${req.method} ${req.originalUrl} no implementada`
    }))
 });

httpServer.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




