const express = require('express')
const router = express.Router()
const SQLHelper = require('../helpers/sql-helper.js')
const path = require('path')
const MongooseHelper = require('../helpers/moongose-helper.js')
const Schema = require('mongoose').Schema

const productSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true}
})

const productsHelper = new MongooseHelper("products", productSchema)

/* const mariadb = new SQLHelper({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "coderhouse"
    }
}, "productos") */

function isAuth(req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect("/accounts/login")
    }
}

router.get('/', isAuth, async (req, res)=>{
    const io = req.app.get('socketio')
    let products
    try{
        products = await productsHelper.getAll()
    }
    catch (err){
        console.log(err)
    }
    let name = req.user.username
    res.sendFile(path.join(__dirname, '..', '..', 'src/views/home.html'))
    try {
        io.on('connection', async (socket) => {         
            socket.emit("currentData", name)
            socket.emit("currentProducts", products)
        })
    }
    catch (err) {
        console.log("Failed to connect socket" + err)
    }
})

router.post('/', isAuth, async (req, res)=>{
    const product = req.body
    console.log(product)
    await productsHelper.insert(product)
    const io = req.app.get('socketio')
    const allProducts = await productsHelper.getAll()
    io.sockets.emit("currentProducts", allProducts)
    res.send(`Se guardo el objeto.`)
})

module.exports = router

