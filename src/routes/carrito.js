const express = require('express')
const router = express.Router()
const Contenedor = require('../helpers/contenedor-sync.js')


const contenedor = new Contenedor('src/data/carritos.txt')


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




module.exports = router