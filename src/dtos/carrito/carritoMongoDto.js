const mongooseHelper = require('../../helpers/mongoose-helper.js')
const mongoose = require('mongoose')


const carritoSchema = mongoose.Schema({
    fecha: {type: Date, required: true, default: new Date()},
    productos: {type: Array, required: true},
})


class carritoMongoDto extends mongooseHelper{
    constructor(){
        super('carrito', carritoSchema)
    }

}

module.exports = carritoMongoDto