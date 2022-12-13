const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()
console.log("Environmental variables", (process.env.STATE || "not loaded") )




/* const productosRouter = require('./routes/productos.js')
const carritoRouter = require('./routes/carrito.js')
const productosTestRouter = require("./routes/productosTest.js") */

const handlebars = require('express-handlebars')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const bodyParser = require('body-parser')
const passport = require('passport')


const homeRouter = require('./routes/home.js')(io)
const accountsRouter = require('./routes/accounts')
const internalRouter = require('./routes/internal')
const randomsRouter = require('./routes/randoms')

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

app.use(express.static('src/scripts'))

app.use(homeRouter)
app.use("/accounts", accountsRouter)
app.use("/internal", internalRouter)
app.use("/api/randoms", randomsRouter)

/* app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)
app.use("/api/productos-test", productosTestRouter) */


// Handleo todo lo no implementado aca
app.all("*", (req, res) => {
    res.status(404)
    res.end(JSON.stringify({
        error: -2,
        descripcion: `ruta ${req.method} ${req.originalUrl} no implementada`
    }))
 });

const PORT = process.env.PORT || 9000



httpServer.listen(PORT, ()=>{
    console.log(`App started and listening on port ${PORT} :) - Current PID is ${process.pid}`)
})











