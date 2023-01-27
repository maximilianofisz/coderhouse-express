const mongoose = require('mongoose')
const dbHelperFactory = require('./dbHelperFactory')

module.exports = class mongooseHelper extends dbHelperFactory {
    constructor(name, schema) {
        super()
        console.log(process.env.MONGOURL)
        mongoose.connect(process.env.MONGOURL) 
        this.model = mongoose.model(name, schema)
    }
    async getAll(){
        return await this.model.find().lean()
    }
    async getOne(identifier){
        return await this.model.findOne(identifier).lean()
    }
    async getById(id){
        return await this.model.findById(id).lean()
    }
    async save(data){
        let saved = await this.model.create(data)
        return saved
    }
    async deleteById(id){
        await this.model.deleteOne({_id: id})
        return "Data deleted"
    }

    async deleteAll(){
        throw Error("Method not implmented")
    }
    async updateById(id, newData){
        await this.model.updateOne({_id: id,}, newData)
    }

    async updateOne(identifier, newData){
        await this.model.updateOne(identifier, newData)
    }
    

}