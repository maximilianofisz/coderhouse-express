const express = require('express')
const router = express.Router()
const SQLHelper = require('../helpers/sql-helper.js')
const path = require('path')

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
        res.render("login", {layout: false})
    }
    else{
        const io = req.app.get('socketio')
        let products
        try{
            products = await mariadb.getAll()
        }
        catch (err){
            console.log(err)
        }
        let name = req.session.name
        io.on('connection', async (socket) => {            
            socket.emit("currentData", name)
            socket.emit("currentProducts", products)
        })
        res.sendFile(path.join(__dirname, '..', '..', 'src/views/home.html'))
    }
})

router.post('/', async (req, res)=>{
    const product = req.body
    await mariadb.insert(product)
    const io = req.app.get('socketio')
    const allProducts = await mariadb.getAll()
    io.sockets.emit("currentProducts", allProducts)
    res.send(`Se guardo el objeto.`)
})


router.post('/login', async (req, res)=>{
    req.session.login = true
    req.session.name = req.body.username
    res.redirect("/")    
})

router.get('/logout', async (req, res) => {
    if(!req.session.login){
        res.render("login", {layout: false})
    }
    else{
        let name = req.session.name
        req.session.destroy()
        res.render('logout', {data: name, layout: false})
    }

})



module.exports = router

