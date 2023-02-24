const mongoose = require('mongoose')

orderSchema = mongoose.Schema({
    items: {type: Array, required: true},
    orderNumber: {type: Number, required: true},
    date: {type: String, required: true},
    email: {type: String, required: true}
})

module.exports = orderSchema