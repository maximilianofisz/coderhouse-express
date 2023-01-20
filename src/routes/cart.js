const express = require('express')
const router = express.Router()

const { getCarts, getCartByEmail, createCart,
    addItemToCart } = require("../controllers/cartController")


router.get('/', getCarts )

router.get('/:email/products', getCartByEmail)

router.post('/:email', createCart)

router.post('/:email/productos/:idprod', addItemToCart)

module.exports = router
