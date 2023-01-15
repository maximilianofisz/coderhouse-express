const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
// Dependencias
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const passport = require('passport')
const handlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')
const pino = require('pino')

// Loggers
const infoLog = pino()
const warningLog = pino(pino.destination('./warn.log'))
const errorLog = pino(pino.destination('./error.log'))


// Envs
require('dotenv').config()
console.log("Environmental variables", (process.env.STATE || "not loaded") )

const Msgs = require('./helpers/msgsHelper.js')
const Products = require('./helpers/productsHelper.js')













const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)



// Routers (temporalmente aca por la dependencia de 'IO')
const homeRouter = require('./routes/home.js')(io)
const accountsRouter = require('./routes/accounts')
const internalRouter = require('./routes/internal')
const randomsRouter = require('./routes/randoms')
/* const productosRouter = require('./routes/productos.js')
const carritoRouter = require('./routes/carrito.js')
const productosTestRouter = require("./routes/productosTest.js") */


// App.sets
app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
/* Necesito esto para poder usar sockers en mi Router */
app.set('socketio', io)


// App.uses
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        autoRemove: 'native',
        ttl: 10 * 60,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        
    }),
    secret: "coderhouse",
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.engine("hbs",
 handlebars.engine({
    extname: ".hbs",
    partialsDir: __dirname + '/views/partials'
}))

// Routes
app.use(express.static('src/scripts'))

app.use(homeRouter)
app.use("/accounts", accountsRouter)
app.use("/internal", internalRouter)
app.use("/api/randoms", randomsRouter)

/* app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)
app.use("/api/productos-test", productosTestRouter) */

// Middlewares
// Log time and request


app.use(express.static("uploads"))

// Handle non-implemented
app.all("*", (req, res) => {
    res.status(404)
    warningLog.warn({method: req.method, route: req.originalUrl})
    res.end(JSON.stringify({
        error: -2,
        descripcion: `ruta ${req.method} ${req.originalUrl} no implementada`
    }))
 });

io.on('connection', async (socket) => {       
    let products
    let msgs
    try{
        products = await Products.find({}).lean()
        
    }
    catch (err){
        errorLog.error({error: err})
    }
    
    try{
        msgs = await Msgs.find({}).lean()
    }
    catch (err){
        errorLog.error({error: err})
    }

    

    socket.emit("currentProducts", products)
    socket.emit("currentMsgs", msgs)
    
    

    /* socket.on("newMsg", async (msg) => {
        msg.date = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`
        Msgs.create(msg)
        let msgs = await Msgs.find().lean()
        io.sockets.emit("currentMsgs", msgs)
    }) */

    socket.on("newProduct", async (product) => {
        await Products.create(product)
        let products = await Products.find().lean()
        io.sockets.emit("currentProducts", products)
    })
})



// Start
const PORT = process.env.PORT || 9000
httpServer.listen(PORT, ()=>{
    console.log(`App started and listening on port ${PORT} :) - Current PID is ${process.pid}`)
})











