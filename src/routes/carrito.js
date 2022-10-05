const express = require('express')
const router = express.Router()
const Contenedor = require('../helpers/contenedor-sync.js')


const contenedor = new Contenedor('src/data/carritos.txt')
const productos = new Contenedor('src/data/productos.txt')

router.post('/', (req, res)=>{
    // Creo un objeto carrito que voy a guardar commo si fuera un producto (mi helper le agrega id y timestamp). Le agrego manualmente la lista de productos del body
    const productos = req.body
    let carrito = {
        productos: productos
    }
    
    contenedor.save(carrito)
    const allCarritos = contenedor.getAll()
    const id = allCarritos[allCarritos.length-1]["id"]
    res.send(`Se guardo el carrito. El ID asignado es ${id}`)
})

router.delete('/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    if(contenedor.getbyId(id)){
        contenedor.deleteById(id)
        res.send(`El carrito con ID ${id} fue eliminado`)
    }
    else{
        res.send({error: 'Carrito no encontrado'})
    }
})

router.get('/:id/productos', (req, res)=>{
    const carrito = contenedor.getbyId(parseInt(req.params.id))
    if(carrito){
        res.send(carrito.productos)
    }
    else{
        res.send({error: 'Carrito no encontrado'})
    }
})

router.post('/:id/productos/:idprod', (req, res)=>{
    const id = parseInt(req.params.id)
    const idprod = parseInt(req.params.idprod)
    const carrito = contenedor.getbyId(id)
    const producto = productos.getbyId(idprod)
    if(carrito && producto){
        carrito.productos.push(producto)
        contenedor.deleteById(parseInt(id))
        contenedor.saveWithId(carrito, id)
        res.send(`Se agrego el producto de ID ${idprod} al carrito ${id}`)
    }
    else{
        res.send({error: 'Carrito o producto a agregar no encontrado'})
    }
})

router.delete('/:id/productos/:idprod', (req, res) =>{
    const id = parseInt(req.params.id)
    const idprod = parseInt(req.params.idprod)
    const carrito = contenedor.getbyId(id)

    if(carrito){
        let productos = carrito.productos
        let productoABorrar = productos.findIndex(x => x.id === idprod)
        if (productoABorrar == -1){
            res.send({error: 'El producto no fue encontrado'})
        }
        else{
            productos.splice(productoABorrar, 1)
            carrito.productos = productos
            contenedor.deleteById(id)
            contenedor.saveWithId(carrito, id)
            res.send(`Se elimino un producto de ID ${idprod} del carrito ${id}`)

        }
    }
    else{
        res.send({error: 'El carrito no fue encontrado'})
    }
})


module.exports = router