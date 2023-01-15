const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURL)

let Users = mongoose.model("users", new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phoneNumber: {type: String, required: true}
}))


module.exports = Users