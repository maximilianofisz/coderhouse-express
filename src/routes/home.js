const express = require('express')
const router = express.Router()
const moment = require('moment')
const pino = require('pino')
const { session } = require('passport')
const errorLog = pino(pino.destination('./error.log'))
const isAuth = require("../middlewares/isAuth")
const { getHome } = require("../controllers/homeController")
const logInformation = require('../middlewares/logInformation') 
router.use(logInformation)

router.get('/', isAuth, getHome)

router.get("/errors", (req, res) => res.render("errors", {layout: false}))

module.exports = router

