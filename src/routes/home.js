const express = require('express')
const router = express.Router()
const path = require('path')
const MongooseHelper = require('../helpers/moongose-helper.js')
const Schema = require('mongoose').Schema
const moment = require('moment')
const pino = require('pino')
const errorLog = pino(pino.destination('./error.log'))

module.exports = function(io){
    const msgSchema = new Schema({
        text: {type: String, required: true},
        author: {type: Array, required: true},
        date: {type: String, required: true}
    })
    
    const productSchema = new Schema({
        name: {type: String, required: true},
        price: {type: Number, required: true},
        thumbnail: {type: String, required: true}
    })
    
    const msgHelper = new MongooseHelper("msgs", msgSchema)
    const productsHelper = new MongooseHelper("products", productSchema)
    

    function isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next()
        }
        else {
            res.redirect("/accounts/login")
        }
    }
    
    router.get('/', isAuth, async (req, res)=>{
        let products
        let msgs
        try{
            products = await productsHelper.getAll()
        }
        catch (err){
            errorLog.error({method: req.method, route: req.originalUrl, error: err})
        }

        try{
            msgs = await msgHelper.getAll()
        }
        catch (err){
            errorLog.error({method: req.method, route: req.originalUrl, error: err})
        }

        res.sendFile(path.join(__dirname, '..', '..', 'src/views/home.html'))
        try {
            // Quiero mover esto para afuera pero no se como acceder a req.user MMM
            io.on('connection', async (socket) => {         
                socket.emit("currentUser", req.user)
                socket.emit("currentProducts", products)
                socket.emit("currentMsgs", msgs)

                socket.on("newMsg", async (msg) => {
                    msg.date = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}]`
                    msgHelper.insert(msg)
                    let msgs = await msgHelper.getAll()
                    io.sockets.emit("currentMsgs", msgs)
                })
            })
        }
        catch (err) {
            errorLog.error({method: req.method, route: req.originalUrl, error: err})
        }
    })
    
    router.post('/', isAuth, async (req, res)=>{
        const product = req.body
        console.log(product)
        try {
            await productsHelper.insert(product)
        }
        catch (err){
            errorLog.error({method: req.method, route: req.originalUrl, error: err})
        }
        
        try {
            const allProducts = await productsHelper.getAll()
        }
        catch (err){
            errorLog.error({method: req.method, route: req.originalUrl, error: err})
        }
        
        io.sockets.emit("currentProducts", allProducts)
        res.send(`Se guardo el objeto.`)
    })
    return router
}

