const mongoose = require('mongoose')

productSchema = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    photo: {type: String, required: true},
    category: {type: String, required: true}
})

module.exports = productSchema