const express = require('express')
const router = express.Router()
const moment = require('moment')
const pino = require('pino')
const { session } = require('passport')
const errorLog = pino(pino.destination('./error.log'))
const isAuth = require("../middlewares/isAuth")
const { getChat, getOwnMessages } = require("../controllers/chatController")
const logInformation = require('../middlewares/logInformation') 
router.use(logInformation)

router.get('/', isAuth, getChat)

router.get('/:email', isAuth, getOwnMessages)

module.exports = router