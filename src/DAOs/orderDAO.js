const mongooseHelper = require('./mongooseHelper')
const orderSchema = require('../models/orderSchema')

module.exports = class orderDAO extends mongooseHelper {
    constructor() {
        super("orders", orderSchema)
    }

    // funciones propias de este dao
}