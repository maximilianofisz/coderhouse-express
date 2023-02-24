const mongooseHelper = require('./mongooseHelper')
const productSchema = require('../models/productSchema')

module.exports = class productDAO extends mongooseHelper {
    constructor() {
        super("products", productSchema)
    }
    async getByCategory(category) {
        if(category == "all") {
            return await this.model.find().lean() 
        }
        else {
            return await this.model.find({category: category}).lean()
        }
        
    }
}

    // funciones propias de este dao