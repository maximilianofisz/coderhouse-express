const mongoose = require('mongoose')
const dbHelperFactory = require('./dbHelperFactory')

module.exports = class mongooseHelper extends dbHelperFactory {
    constructor(name, schema) {
        this.model = mongoose.model(name, schema)
    }
    
    async getAll(){
        return await this.model.find().lean()
    }
    async getById(){
        throw Error("Method not implmented")
    }
    async save(){
        throw Error("Method not implmented")
    }
    async deleteById(){
        throw Error("Method not implmented")
    }
    async deleteAll(){
        throw Error("Method not implmented")
    }
    async updateById(){
        throw Error("Method not implmented")
    }
}