const pino = require('pino')
const infoLog = pino()

function logInformation(req, res, next) {
    infoLog.info(`${req.method} + ${req.originalUrl}`)
    next()
}

module.exports = logInformation