require('dotenv').config()
console.log("Environmental variables", (process.env.STATE || "not loaded") )
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
// Dependencias
const cookieParser = require('cookie-parser')
const session = require('express-session')



const bodyParser = require('body-parser')
const passport = require('passport')
const handlebars = require('express-handlebars')

const pino = require('pino')

// Loggers
const infoLog = pino()
const warningLog = pino(pino.destination('./warn.log'))
const errorLog = pino(pino.destination('./error.log'))


// Envs

const { mongoSession } = require('./config/sessionConfig')

// DBs
const mgfactory = require("./helpers/mongooseFactory")
const mongooseFactory = new mgfactory()

const Msgs = mongooseFactory.create("msgs")
const Products = mongooseFactory.create("products")


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


const homeRouter = require('./routes/home.js')
const accountsRouter = require('./routes/accounts')


// App.sets
app.set("view engine", "hbs")
app.set("views", __dirname + "/views")


// App.uses
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())


app.use(mongoSession)

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
  
    try{
        let products = await Products.find({}).lean()
        let msgs = await Msgs.find({}).lean()
        socket.emit("currentProducts", products)
        socket.emit("currentMsgs", msgs)

        socket.on("newProduct", async (product) => {
            await Products.create(product)
            let products = await Products.find().lean()
            io.sockets.emit("currentProducts", products)
        })

        /* socket.on("newMsg", async (msg) => {
        msg.date = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`
        Msgs.create(msg)
        let msgs = await Msgs.find().lean()
        io.sockets.emit("currentMsgs", msgs)
    }) */
    }
    catch (err){
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
})


// Start
const PORT = process.env.PORT || 9000
httpServer.listen(PORT, ()=>{
    console.log(`App started and listening on port ${PORT} :) - Current PID is ${process.pid}`)
})











