const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/ecommerce")

class mongooseHelper{
    constructor(collection, schema){
        this.collection = mongoose.model(collection, schema)
    }

    async getByID(id){
        const data = await this.collection.findOne({_id: id}).lean()
        return data
    }


    async getAll(){
        const data = await this.collection.find({})
        return data
    }

    async insert(data){
        const model = new this.collection(data)
        await model.save()

    }

    async update(id, data){
        data.fecha = new Date()
        const model = await this.collection.findOne({_id: id})
        model.overwrite(data)
        model.save()
    }

    async delete(id){
        await this.collection.deleteOne({_id: id})
    }



}

module.exports = mongooseHelper