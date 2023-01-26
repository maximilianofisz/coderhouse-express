const mongoose = require('mongoose')

msgSchema = mongoose.Schema({
    text: {type: String, required: true},
    author: {type: Array, required: true},
    date: {type: String, required: true}
})

module.exports = msgSchema