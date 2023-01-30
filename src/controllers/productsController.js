const pino = require('pino')
const errorLog = pino(pino.destination('./error.log'))
const DAOFactory = require('../DAOs/DAOFactory')
const Products = DAOFactory.getProductDAO()

async function getProducts(req, res) {
    try {
        res.send(await Products.getAll())
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function getProductById(req, res) {
    try {
        res.send(await Products.getById(req.params.id)) 
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function postProduct(req, res) {
    try {
        await Products.save(req.body)
        res.send(req.body)
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function updateProduct(req, res) {
    try {
        await Products.updateById(req.params.id, req.body)
        res.send(req.body) 
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function deleteProduct(req, res) {
    try {
        await Products.deleteById(req.params.id)
        res.send(req.params.id) 
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
    
}

module.exports = { getProducts, getProductById, postProduct, updateProduct, deleteProduct }