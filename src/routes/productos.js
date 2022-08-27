const express = require('express')
const router = express.Router()
const random = require('random')
const Contenedor = require('../helpers/contenedor-sync.js')


const contenedor = new Contenedor('src/data/productos.txt')


router.get('/productos', (req, res)=>{
    let currentData = contenedor.getAll()
    res.send(currentData)
})


router.get('/productoRandom', (req, res)=>{
    let randomNumber = random.int(1, 3)
    let currentData = contenedor.getbyId(randomNumber)
    res.send(currentData)
})

module.exports = router

