const mongooseHelper = require('../../helpers/mongoose-helper.js')
const mongoose = require('mongoose')


const productoSchema = mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true},
    codigo: {type: Number, required: true},
    stock: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    fecha: {type: Date, required: true, default: new Date()}
})

class productosMongoDto extends mongooseHelper{
    constructor(){
        super('producto', productoSchema)
    }
}

module.exports = productosMongoDto