const mongooseHelper = require('./mongooseHelper')
const cartSchema = require('../models/cartSchema')

module.exports = class cartDAO extends mongooseHelper {
    constructor() {
        super("carts", cartSchema)
    }
}

    // funciones propias de este dao