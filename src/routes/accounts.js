const express = require('express')
const router = express.Router()
const fs = require('fs')
const session = require('express-session')
const { Mongoose, default: mongoose } = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BcryptHelper = require('../helpers/bcrypt-helper')
const MongoSchema = require('mongoose').Schema
const bcryptHelper = new BcryptHelper()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, req.user.email + ".png")
    } 
})
const upload = multer({storage: storage})
const pino = require('pino')
const infoLog = pino()
const errorLog = pino(pino.destination('./error.log'))

router.use((req, res, next) => {
    infoLog.info(`${req.method} + ${req.originalUrl}`)
    next()
})


const schema = new MongoSchema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phoneNumber: {type: String, required: true}

})

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect("/accounts/login")
    }
}

const Users = mongoose.model("user", schema)

passport.use('login', new LocalStrategy({usernameField: 'email'},
    (email, password, done) => {
        Users.findOne({email: email}, (err, user) => {
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

passport.use('register', new LocalStrategy({usernameField: 'email', passwordField: 'password', passReqToCallback: true},
    (req, email, password, done) => {
        Users.findOne({email: email}, (err, user) => {
            if (err) {
                console.log("Error while registering" + err)
                return done(err)
            }
            if (user) {
                console.log("Email already exists")
                return done(null, false)                
            }
            else{
                const newUser = {
                    password: bcryptHelper.hashPassword(password),
                    email: req.body.email,
                    fullName: req.body.fullname,
                    address: req.body.address,
                    age: req.body.age,
                    phoneNumber: req.body.phonenumber
                }

                Users.create(newUser, async (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    else{
                        await fs.copyFile("uploads/sus.png", "uploads/" + newUser.email + ".png", (err) => {
                            if (err) {
                                errorLog.error({method: req.method, route: req.originalUrl, error: err})
                            }
                            else {
                                return done(null, user)
                            }
                        })
                        
                    }
                })
            }
        })
}))

passport.serializeUser( async (user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    try {
        Users.findById(id, done)
    }
    catch (err) {
        errorLog.error({method: req.method, route: req.originalUrl, error: err})
    }
    
})


router.get("/register", async (req, res) => {
    console.log("rendering!!")
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

router.post("/uploadProfilePic", upload.single("avatar"), async (req, res) => {
    console.log("uploaded!")
    res.redirect("/accounts/profile")
})

router.get("/profile", isAuth, async (req, res) => {
    let user = await Users.findOne({email: req.user.email})
    res.render('profile', {layout: false, data: {
        email: user.email,
        name: user.fullName,
        address: user.address,
        age: user.age,
        phone_number: user.phoneNumber
    }})
})

router.get("/incorrectcreds", async (req, res) => {
    res.render("incorrectcreds", {layout: false})
})

router.get("/existingcreds", async (req, res) => {
    res.render("existingcreds", {layout: false})
})

router.get('/logout', async (req, res) => {
    res.render("logout", {data: req.user.email, layout: false})
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
})

module.exports = router