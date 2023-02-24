const mongooseHelper = require('./mongooseHelper')
const msgSchema = require('../models/msgSchema')

module.exports = class msgDAO extends mongooseHelper {
    constructor() {
        super("msgs", msgSchema)
    }

    async getAllMsgs(email) {
        return await this.model.find({email: email}).lean()
    }
    // funciones propias de este dao
}