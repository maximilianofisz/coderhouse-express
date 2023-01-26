const mongoose = require('mongoose')
const dbHelperFactory = require('./dbHelperFactory')

module.exports = class mongooseHelper extends dbHelperFactory {
    constructor(name, schema) {
        this.model = mongoose.model(name, schema)
    }
    
    async getAll(){
        return await this.model.find().lean()
    }
    async getById(id){
        return await this.model.findById(id).lean()
    }
    async save(data){
        await this.model.create(data)
        return "Data saved"
    }
    async deleteById(id){
        await this.model.deleteOne({_id: id})
        return "Data deleted"

    }
    async deleteAll(){
        throw Error("Method not implmented")
    }
    async updateById(id, newData){
        await this.model.findByIdAndUpdate({_id: id,}, newData)
    }
}