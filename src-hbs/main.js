const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const Contenedor = require('./helpers/contenedor-sync.js')
const contenedor = new Contenedor('src-hbs/data/productos.txt')

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

/* Envio la lista inicial de productos a quien se conecte, el resto, se encarga el router (productosRouter) */
io.on('connection', (socket) => {
    let products = contenedor.getAll()
    socket.emit("currentProducts", products)
})

httpServer.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




