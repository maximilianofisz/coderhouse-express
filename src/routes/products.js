const express = require('express')
const router = express.Router()
const { getProducts, postProduct, getProductById, getProductsLastTest, updateProduct, deleteProduct, getProductsByCategory, getProductsDetailed } = require('../controllers/productsController')

router.get("/", getProducts)

router.get("/:id", getProductById)

router.get("/detailed/:id", getProductsDetailed)

router.get("/categories/:category", getProductsByCategory)

router.get("/testing/last", getProductsLastTest)

router.post("/", postProduct)

router.put("/:id", updateProduct)

router.delete("/:id", deleteProduct)

module.exports = router