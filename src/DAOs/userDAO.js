const mongooseHelper = require('./mongooseHelper')
const userSchema = require('../models/userSchema')

module.exports = class userDAO extends mongooseHelper {
    constructor() {
        super("users", userSchema)
    }

    // funciones propias de este dao
}