const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURL)

let Carts = mongoose.model("carts", new mongoose.Schema({
    email: {type: String, required: true},
    items: {type: Array, required: true}   
}))


module.exports = Carts