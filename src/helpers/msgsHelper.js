const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURL)

let Msgs = mongoose.model("msgs", new mongoose.Schema({
    text: {type: String, required: true},
    author: {type: Array, required: true},
    date: {type: String, required: true}
}) )


module.exports = Msgs