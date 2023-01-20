const mongoose = require('mongoose')
const userSchema = require('../models/userSchema')
const msgSchema = require('../models/msgSchema')
const cartSchema = require('../models/cartSchema')
const productSchema = require('../models/productSchema')


mongoose.connect(process.env.MONGOURL)

class mongooseFactory {
    create(collection) {
        switch(collection){
            case "users":
            return mongoose.model(collection, userSchema)
            case "msgs":
            return mongoose.model(collection, msgSchema)
            case "carts":
            return mongoose.model(collection, cartSchema)
            case "products":
            return mongoose.model(collection, productSchema)
        }       
    }
}

module.exports = mongooseFactory