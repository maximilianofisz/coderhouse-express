const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURL)

let Products = mongoose.model("products", new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    photo: {type: String, required: true}
}))


module.exports = Products