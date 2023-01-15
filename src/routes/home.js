const express = require('express')
const router = express.Router()
const path = require('path')
const Msgs = require('../helpers/msgsHelper.js')
const Products = require('../helpers/productsHelper.js')
const mongoose = require('mongoose')
const Schema = require('mongoose').Schema
const moment = require('moment')
const pino = require('pino')
const { session } = require('passport')
const errorLog = pino(pino.destination('./error.log'))

module.exports = function(io){

    

    function isAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next()
        }
        else {
            res.redirect("/accounts/login")
        }
    }
    
    router.get('/', isAuth, async (req, res)=>{
        data = {
            user: req.user
        }
        
        res.render("home", {layout: false, data: data})

    })
    

    return router
}

