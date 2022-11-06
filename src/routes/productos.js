const express = require('express')
const router = express.Router()
const random = require('random')
/* const Contenedor = require('./helpers/contenedor-sync.js') */

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

/* const contenedor = new Contenedor('src/data/productos.txt') */

// Middleware para autorizar o no ciertas rutas. Queda hardcodeado para bloquear todo menos GET.
const isAdmin = ((req, res, next) => {
    const isAdmin = req.headers["isadmin"]
    let needsAuth = false
    if (req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
        needsAuth = true
    }

    if (needsAuth && isAdmin == "true"){
        next()
    }
    else if(!needsAuth){
        next()
    }
    if(needsAuth && (isAdmin == null || isAdmin != "true")){
        res.send({
            error: -1,
            descripcion: `ruta ${req.method} ${req.originalUrl} no autorizada`
         })
    }
})


router.get('/', isAdmin, async (req, res)=>{
    let currentData

    try{
        currentData = mariadb.getAll()
    }
    catch (err){
        console.log(err)
    }

    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'No hay productos'})
    }

})

router.get('/:id', (req, res)=>{
    const currentData = contenedor.getbyId(parseInt(req.params.id))
    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'Producto no encontrado'})
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

router.put('/:id', (req, res) =>{
    const product = req.body
    const id = parseInt(req.params.id)
    if(contenedor.getbyId(id)){
        contenedor.deleteById(id)
        contenedor.saveWithId(product, id)//
        res.send(`Fue actualizado el producto con ID ${id}`)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }

})

router.delete('/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    if(contenedor.getbyId(id)){
        contenedor.deleteById(id)
        res.send(`El producto con ID ${id} fue eliminado`)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
})









// Post desde index.html
/* router.post('/productos', (req, res) =>{
    const product = {
        title:   req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    }
    contenedor.save(product) */

    /* Me traigo la instancia de IO del main, la lista actualizada de productos y la emito globalmente, luego de cada insercion */
/*     const io = req.app.get('socketio')
    const allProducts = contenedor.getAll()
    io.sockets.emit("currentProducts", allProducts) */

/*     const allProducts = contenedor.getAll()
    const id = allProducts[allProducts.length-1]["id"] */

    
/*     res.end()
}) */


/* router.get('/productoRandom', (req, res)=>{
    let randomNumber = random.int(1, 3)
    let currentData = contenedor.getbyId(randomNumber)
    res.send(currentData)
})
 */

module.exports = router

