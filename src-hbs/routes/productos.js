const express = require('express')
const router = express.Router()
const random = require('random')
const Contenedor = require('../helpers/contenedor-sync.js')


const contenedor = new Contenedor('src-hbs/data/productos.txt')


router.get('/productos', (req, res)=>{
    let currentData = contenedor.getAll()
    res.render('productos', {
        data: currentData
    })
})

/* router.get('/:id', (req, res)=>{
    const currentData = contenedor.getbyId(parseInt(req.params.id))
    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
}) */

/* router.post('/', (req, res)=>{
    const product = req.body
    contenedor.save(product)
    const allProducts = contenedor.getAll()
    const id = allProducts[allProducts.length-1]["id"]
    res.send(`Se guardo el objeto. El ID asignado es ${id}`)
}) */


// Post desde index.html
router.post('/productos', (req, res) =>{
    const product = {
        title:   req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    }
    contenedor.save(product)

    /* Me traigo la instancia de IO del main, la lista actualizada de productos y la emito globalmente, luego de cada insercion */
    const io = req.app.get('socketio')
    const allProducts = contenedor.getAll()
    io.sockets.emit("currentProducts", allProducts)

/*     const allProducts = contenedor.getAll()
    const id = allProducts[allProducts.length-1]["id"] */

    
    res.end()
})



/* router.put('/:id', (req, res) =>{
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

}) */

/* router.delete('/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    if(contenedor.getbyId(id)){
        contenedor.deleteById(id)
        res.send(`El producto con ID ${id} fue eliminado`)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
}) */



/* router.get('/productoRandom', (req, res)=>{
    let randomNumber = random.int(1, 3)
    let currentData = contenedor.getbyId(randomNumber)
    res.send(currentData)
})
 */


module.exports = router

