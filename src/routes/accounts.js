const express = require('express')
const router = express.Router()
const session = require('express-session')
const { Mongoose, default: mongoose } = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BcryptHelper = require('../helpers/bcrypt-helper')
const MongoSchema = require('mongoose').Schema
const bcryptHelper = new BcryptHelper()

const schema = new MongoSchema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

const Users = mongoose.model("user", schema)

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        Users.findOne({username: username}, (err, user) => {
            if (err) {
                return done(err)
            }

            if (!user) {
                console.log("user not found")
                return done(null, false)
                
            }

            if (!bcryptHelper.checkPassword(user.password, password)){
                return done(null, false)
            }
            return done(null, user)
        })
    }
))

passport.use('register', new LocalStrategy({passReqToCallback: true},
    (req, username, password, done) => {
        Users.findOne({$or: [{username: username}, {email: req.body.email}]}, (err, user) => {
            if (err) {
                console.log("Error while registering" + err)
                return done(err)
            }
            if (user) {
                console.log("User or email already exists")
                return done(null, false)                
            }
            else{
                const newUser = {
                    username: username,
                    password: bcryptHelper.hashPassword(password),
                    email: req.body.email                    
                }
                Users.create(newUser, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    else{
                        console.log(user)
                        return done(null, user)
                    }
                })
            }
        })
}))

passport.serializeUser( async (user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    Users.findById(id, done)
})


router.get("/register", async (req, res) => {
    res.render("register", {layout: false})
})

router.post("/register", passport.authenticate('register', {failureRedirect: "/accounts/existingcreds"}), async (req, res) => {
    req.session.save()
    res.redirect("/")
})


router.get("/login", async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/")
    }
    else {
        res.render("login", {layout: false})
    }    
})

router.post('/login', passport.authenticate('login', {failureRedirect: "/accounts/incorrectcreds"}), async (req, res)=> {
    req.session.save()
    res.redirect("/")    
})

router.get("/incorrectcreds", async (req, res) => {
    res.render("incorrectcreds", {layout: false})
})

router.get("/existingcreds", async (req, res) => {
    res.render("existingcreds", {layout: false})
})

router.get('/logout', async (req, res) => {
    res.render("logout", {data: req.user.username, layout: false})
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
})

module.exports = router