const mgfactory = require("../helpers/mongooseFactory")
const mongooseFactory = new mgfactory()

const Carts = mongooseFactory.create("carts")
const Products = mongooseFactory.create("products")

async function getCarts(req, res) {
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
}

async function getCartByEmail(req, res) {
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
}

async function createCart(req, res) {
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
}

async function addItemToCart(req, res) {
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
}

module.exports = {getCarts, getCartByEmail, createCart, addItemToCart}