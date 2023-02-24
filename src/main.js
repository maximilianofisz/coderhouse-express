require('dotenv').config()
console.log("Environmental variables", (process.env.STATE || "not loaded") )
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
// Dependencias
const cookieParser = require('cookie-parser')
const session = require('express-session')

const productDTO = require('./DTOs/productDTO')

const moment = require('moment')
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
const DAOsFactory = require('./DAOs/DAOFactory')
const Msgs = DAOsFactory.getMsgDAO()
const Products = DAOsFactory.getProductDAO()
const Conversations = DAOsFactory.getConversationDAO()
const Messages = DAOsFactory.getMsgDAO()

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


const homeRouter = require('./routes/home.js')
const accountsRouter = require('./routes/accounts')
const productsRouter = require('./routes/products')
const chatRouter = require("./routes/chat")


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
app.use("/products", productsRouter)
app.use("/chat", chatRouter)

app.get("/internal/config", (req, res) => {
    let config = {
        environment: process.env.ENV,
        port: process.env.PORT,
        dbConnectionString: process.env.MONGOURL,
        mailerAddress: process.env.ADMIN_MAIL_ADDRESS,
        sessionTTL: process.env.SESSION_TTL
    }
    res.render("config", {data: config, layout: false})
})


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
        let products = await Products.getAll()
        let msgs = await Msgs.getAll()
        let conversations = await Conversations.getAll()
        conversations.reverse()
        socket.emit("currentProducts", products)
        socket.emit("currentMsgs", msgs)
        socket.emit("currentConversations", conversations)



        socket.on("newProduct", async (data) => {
            let product = new productDTO(data.name, data.price, data.description, data.photo, data.category)
            await Products.save(product)
            products = await Products.getAll()
            io.sockets.emit("currentProducts", products)
        })

        socket.on("filterProducts", async (data) => {
            let products = await Products.getByCategory(data)
            socket.emit("filteredProducts", products)
        })

        socket.on("newConvo", async (data) => {
            let messages = []
            messages.push({
                text: data.msg,
                date: `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`,
                email: data.author
            })
            await Conversations.save({
                messages: messages
            })

            let message = {
                text: data.msg,
                date: `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`,
                email: data.author
            }
            await Messages.save(message)

            let conversations = await Conversations.getAll()
            conversations.reverse()
            io.sockets.emit("currentConversations", conversations)
            console.log(conversations)
            console.log("new convo1")
        })

        socket.on("newMsg", async (data) => {
            let conversation = await Conversations.getById(data._id)
            let message = {
                text: data.msg,
                date: `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`,
                email: data.author
            }

            await Messages.save(message)

            conversation.messages.push(message)
            await Conversations.updateById(data._id, conversation)
            let conversations = await Conversations.getAll()
            conversations.reverse()
            io.sockets.emit("currentConversations", conversations)
            console.log(conversations)
            console.log("new msg1")
        })


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

module.exports = app











