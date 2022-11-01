const express = require('express')
const router = express.Router()
const moongose = require('mongoose')

const carritoMongoDto = require('../dtos/carrito/carritoMongoDto.js')
const carritoFirestoreDto = require("../dtos/carrito/carritoFirestoreDto.js")
const productoFirestoreDto = require("../dtos/productos/productosFirestoreDto.js")
const productoMongoDto = require('../dtos/productos/productosMongoDto.js')



let carritos
let productos

switch (process.env.dbType){
    case "mongo":
        carritos = new carritoMongoDto()
        productos = new productoMongoDto()
        break
    case "firestore":
        carritos = new carritoFirestoreDto()
        productos = new productoFirestoreDto()
        break
}

router.get('/', async (req, res)=>{
    let currentData
    try{
        currentData = await carritos.getAll()
    }
    catch (err){
        console.log(err)
    }

    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'No hay carritos'})
    }

})

router.get('/:id/productos', async (req, res)=>{
    let currentData
    const { id } = req.params
    try {
        currentData = await carritos.getByID(id)
    }
    catch (err){
        console.log(err)
    }
    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'Carrito no encontrado'})
    }
})

router.post('/', async (req, res)=>{
    let carrito = {
        productos: []
    }
    
    try {
        await carritos.insert(carrito)
    }
    catch (err){
        console.log(err)
        res.send(err)
    }
    res.send(`Se guardo el carrito.`)
})

router.delete('/:id', async (req, res) =>{
    const id = req.params.id

    let carrito
    try{
        carrito = await carritos.getByID(id)
    }
    catch (err){
        console.log(err)
    }

    if(carrito){
        carritos.delete(id)
        res.send(`El carrito con ID ${id} fue eliminado`)
    }
    else{
        res.send({error: 'Carrito no encontrado'})
    }
})


router.post('/:id/productos/:idprod', async (req, res)=>{
    const id = req.params.id
    const idprod = req.params.idprod
    let carrito
    let product
    try{
        carrito = await carritos.getByID(id)
        product = await productos.getByID(idprod)
    }
    catch (err){
        console.log(err)
    } 

    if(carrito && product){
        carrito.productos.push(product)
        carritos.update(id, carrito)
        res.send(`Se agrego el producto de ID ${idprod} al carrito ${id}`)
    }
    else{
        res.send({error: 'Carrito o producto a agregar no encontrado'})
    }
})

router.delete('/:id/productos/:idprod', async (req, res) =>{
    const id = req.params.id
    const idprod = req.params.idprod

    let carrito
    try{
        carrito = await carritos.getByID(id)
    }
    catch (err){
        console.log(err)
    }
    if(carrito){
        let productos = carrito.productos
        let productoABorrar = productos.findIndex(x => x._id.toString() === idprod)
        if (productoABorrar == -1){
            res.send({error: 'El producto no fue encontrado'})
        }
        else{
            productos.splice(productoABorrar, 1)
            carrito.productos = productos
            carritos.update(id, carrito)
            res.send(`Se elimino un producto de ID ${idprod} del carrito ${id}`)

        }
    }
    else{
        res.send({error: 'El carrito no fue encontrado'})
    }
})


module.exports = router