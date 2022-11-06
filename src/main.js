const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const moment = require('moment/moment')

const SQLHelper = require('./helpers/sql-helper')

const sqlite = new SQLHelper({
    client: "sqlite3",
    connection: {
    filename: "src/ecommerce/mensajes.sqlite"
    },
    useNullAsDefault: true
}, "mensajes")

const mariadb = new SQLHelper({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "coderhouse"
    }
}, "productos")


const Contenedor = require('./helpers/contenedor-sync.js')


/* const contenedor = new Contenedor('src/data/productos.txt')
const mensajero = new Contenedor('src/data/mensajes.txt') */


const productosRouter = require('./routes/productos.js')
const carritoRouter = require('./routes/carrito.js')
const productosTestRouter = require("./routes/productosTest.js")

const handlebars = require('express-handlebars')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const bodyParser = require('body-parser')


app.engine("hbs",
 handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

app.set("view engine", "hbs")

app.set("views", __dirname + "/views")

/* Necesito esto para poder usar sockers en mi Router */
app.set('socketio', io)

//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('src/public'))
app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)
app.use("/api/productos-test", productosTestRouter)


// Handleo todo lo no implementado aca
app.all("*", (req, res) => {
    res.status(404)
    res.end(JSON.stringify({
        error: -2,
        descripcion: `ruta ${req.method} ${req.originalUrl} no implementada`
    }))
 });

 
// Comente todo lo de websockets que no creo estar usando
/* Envio la lista inicial de productos y mensajes a quien se conecte, el resto, se encarga el router (productosRouter con su evento newProduct) y el evento newMessage */
io.on('connection', async (socket) => {

    let products
    try{
        products = await mariadb.getAll()
    }
    catch (err){
        console.log(err)
    }

    let mensajes
    try{
        mensajes = await sqlite.getAll()
    }
    catch (err){
        console.log(err)
    }

    socket.emit("currentProducts", products)
    socket.emit("currentMessages", mensajes)

    /* Guardo un nuevo mensaje y actualizo a todos los usuarios */
    socket.on("newMessage", async mensaje =>{
        mensaje.fecha = "[" + moment().format('MMMM Do YYYY, h:mm:ss a') + "]"

        try{
            sqlite.insert(mensaje)
        }
        catch (err) {
            console.log(err)
        }

        let mensajes
        try{
            mensajes = await sqlite.getAll()
        }
        catch (err){
            console.log(err)
        }
        
        io.sockets.emit("currentMessages", mensajes)
    })


})

httpServer.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




