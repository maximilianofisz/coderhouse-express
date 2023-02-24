const mongoose = require('mongoose')

conversationSchema = mongoose.Schema({
    messages: {type: Array, required: true},
})

module.exports = conversationSchema