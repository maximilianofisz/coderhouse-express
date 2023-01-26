const mongooseHelper = require('./mongooseHelper')
const productSchema = require('../models/productSchema')

module.exports = class productDAO extends mongooseHelper {
    constructor() {
        super("products", productSchema)
    }
}

    // funciones propias de este dao