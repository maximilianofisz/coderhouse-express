const express = require('express')
const router = express.Router()
const MongoHelper = require('../helpers/moongose-helper')

const userSchema = new MongoSchema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phoneNumber: {type: String, required: true}
})

const cartSchema = new MongoSchema({
    email: {type: String, required: true},
    items: {type: Array, required: true}   
})

const Users = mongoose.model("user", userSchema)
const Carts = mongoose.model("carts", cartSchema)



router.get('/', async (req, res)=>{
    let currentData
    try{
        currentData = await Carts.find({})
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

router.get('/:email/productos', async (req, res)=>{
    let currentData
    const { email } = req.params
    try {
        currentData = await Carts.find({email: email})
    }
    catch (err){
        console.log(err)
    }
    if(currentData){
        res.send(currentData.items)
    }
    else{
        res.send({error: 'Carrito no encontrado'})
    }
})

router.post('/:email', async (req, res)=>{
    let cart = {
        items: [],
        email: req.params.email
    }
    
    try {
        await Carts.create(cart)
    }
    catch (err){
        console.log(err)
        res.send(err)
    }
    res.send(`Se creo el carrito.`)
})

/* router.delete('/:id', async (req, res) =>{
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
}) */


router.post('/:email/productos/:idprod', async (req, res)=>{
    const email = req.params.email
    const idprod = req.params.idprod
    let cart
    let product
    try{
        cart = await Carts.findOne({email: email})
        product = await Products.findOne({id: idprod})
    }
    catch (err){
        console.log(err)
    } 

    if(cart && product){
        cart.items.push(product)
        Carts.updateOne({email: email, items: cart.items})
        res.send(`Se agrego el producto de ID ${idprod} al carrito ${id}`)
    }
    else{
        res.send({error: 'Carrito o producto a agregar no encontrado'})
    }
})

/* router.delete('/:id/productos/:idprod', async (req, res) =>{
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
}) */


module.exports = router
