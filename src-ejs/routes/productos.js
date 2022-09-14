const express = require('express')
const router = express.Router()
const random = require('random')
const Contenedor = require('../helpers/contenedor-sync.js')


const contenedor = new Contenedor('src-ejs/data/productos.txt')


router.get('/productos', (req, res)=>{
    let currentData = contenedor.getAll()
    let dataExists
    if(currentData.length == 0){
        dataExists = false
    }
    else{
        dataExists = true
    }
    res.render('pages/productos', {
        data: currentData,
        dataExists: dataExists
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

    const allProducts = contenedor.getAll()
    const id = allProducts[allProducts.length-1]["id"]
    res.redirect('/')
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

