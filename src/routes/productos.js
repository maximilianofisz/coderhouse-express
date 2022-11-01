const express = require('express')
const router = express.Router()
const random = require('random')
require('dotenv').config()

const productoFirestoreDto = require("../dtos/productos/productosFirestoreDto")
const productoMongoDto = require('../dtos/productos/productosMongoDto.js')

let productos 

switch (process.env.dbType){
    case "mongo":
        productos = new productoMongoDto()
        break
    case "firestore":
        productos =  new productoFirestoreDto()
        break
}

router.get('/', async (req, res)=>{
    let currentData
    try{
        currentData = await productos.getAll()
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

router.get('/:id', async (req, res)=>{
    let currentData
    const { id } = req.params
    try {
        currentData = await productos.getByID(id)
    }
    catch (err){
        console.log(err)
    }
    if(currentData){
        res.send(currentData)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
})

router.post('/', async (req, res)=>{
    const product = req.body
    try {
        await productos.insert(product)
        res.send(`Se guardo el objeto.`)
    }
    catch (err){
        console.log(err)
        res.send(err)
    }

})

router.put('/:id', async (req, res) =>{
    const productoNuevo = req.body
    const id = req.params.id
    let productoViejo
    
    try{
        productoViejo = await productos.getByID(id)
    }
    catch (err){
        console.log(err)
    }

    if(productoViejo){
        await productos.update(id, productoNuevo)
        res.send(`Fue actualizado el producto con ID ${id}`)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
})

router.delete('/:id', async (req, res) =>{
    const id = req.params.id
    let producto
    try{
        producto = await productos.getByID(id)
    }
    catch (err){
        console.log(err)
    }

    if(producto){
        await productos.delete(id)
        res.send(`El producto con ID ${id} fue eliminado`)
    }
    else{
        res.send({error: 'Producto no encontrado'})
    }
})

module.exports = router

