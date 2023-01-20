const mongoose = require('mongoose')

cartSchema = mongoose.Schema({
    email: {type: String, required: true},
    items: {type: Array, required: true}   
})

module.exports = cartSchema