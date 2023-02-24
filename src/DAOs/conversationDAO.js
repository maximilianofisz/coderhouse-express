const mongooseHelper = require('./mongooseHelper')
const conversationSchema = require('../models/conversationSchema')

module.exports = class conversationDAO extends mongooseHelper {
    constructor() {
        super("conversation", conversationSchema)
    }

    // funciones propias de este dao
}