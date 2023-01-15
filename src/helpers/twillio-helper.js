const twilio = require('twilio')

const SID = process.env.TWILIO_SID
const token= process.env.TWILIO_TOKEN

const twilioClient = twilio(SID, token)

module.exports = twilioClient
