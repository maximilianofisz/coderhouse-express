const express = require('express')
const router = express.Router()
const { getProducts, postProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productsController')

router.get("/", getProducts)

router.get("/:id", getProductById)

router.post("/", postProduct)

router.put("/:id", updateProduct)

router.delete("/:id", deleteProduct)

module.exports = router