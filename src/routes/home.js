const express = require('express')
const router = express.Router()

const SQLHelper = require('../helpers/sql-helper.js')

const mariadb = new SQLHelper({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "coderhouse"
    }
}, "productos")

router.get('/', async (req, res)=>{
    if(!req.session.login){
        res.render("login")
    }
    else{
        let products = await mariadb.getAll()
        let data = {
            login: req.session.login,
            name: req.session.name,
            products : products
        }
        res.render("home", {data: data})
    }
})

router.post('/login', async (req, res)=>{
    req.session.login = true
    req.session.name = req.body.username
    res.redirect("/")    
})

router.get('/logout', async (req, res) => {
    if(!req.session.login){
        res.render("login")
    }
    let name = req.session.name
    req.session.destroy()
    res.render('logout', {data: name})
})


router.post('/', async (req, res)=>{
    const product = req.body
    await mariadb.insert(product)
    const io = req.app.get('socketio')
    const allProducts = await mariadb.getAll()
    io.sockets.emit("currentProducts", allProducts)
    res.send(`Se guardo el objeto.`)
})









module.exports = router

