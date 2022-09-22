const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const moment = require('moment/moment')

const Contenedor = require('./helpers/contenedor-sync.js')
const contenedor = new Contenedor('src-hbs/data/productos.txt')
const mensajero = new Contenedor('src-hbs/data/mensajes.txt')


const productosRouter = require('./routes/productos.js')
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

app.use(express.static('src-hbs/public'))
app.use(productosRouter)




/* Envio la lista inicial de productos y mensajes a quien se conecte, el resto, se encarga el router (productosRouter con su evento newProduct) y el evento newMessage */
io.on('connection', (socket) => {
    let products = contenedor.getAll()
    let mensajes = mensajero.getAll()
    socket.emit("currentProducts", products)
    socket.emit("currentMessages", mensajes)

    /* Guardo un nuevo mensaje y actualizo a todos los usuarios */
    socket.on("newMessage", mensaje =>{
        mensaje.fecha = "[" + moment().format('MMMM Do YYYY, h:mm:ss a') + "]"
        mensajero.save(mensaje)
        let mensajes = mensajero.getAll()
        io.sockets.emit("currentMessages", mensajes)
    })


})

httpServer.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




