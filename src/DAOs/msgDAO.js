const mongooseHelper = require('./mongooseHelper')
const msgSchema = require('../models/msgSchema')

module.exports = class msgDAO extends mongooseHelper {
    constructor() {
        super("msgs", msgSchema)
    }

    // funciones propias de este dao
}