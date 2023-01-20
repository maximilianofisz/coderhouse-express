const express = require('express')
const router = express.Router()
const fs = require('fs')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const BcryptHelper = require('../helpers/bcrypt-helper')
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
const logInformation = require('../middlewares/logInformation') 
const errorLog = pino(pino.destination('./error.log'))
router.use(logInformation)

const isAuth = require('../middlewares/isAuth')

const mgfactory = require("../helpers/mongooseFactory")
const mongooseFactory = new mgfactory()
const Users = mongooseFactory.create("users")
const Carts = mongooseFactory.create("carts")

const { getRegister, postRegister, getLogin, postLogin, uploadProfilePic
, getProfile, getCart, addItemToCart, removeItemFromCart, purchaseCart,
getIncorrectCreds, getExistingCreds, logOut } = require('../controllers/accountsController')


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
        }).lean()
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
                        await Carts.create({
                            email: newUser.email,
                            items: []
                        })
                        mailer.sendMail({
                            from: 'Node Server',
                            to: process.env.ADMIN_MAIL_ADDRESS,
                            subject: "New registered user",
                            html: '<h1>New user, ' + newUser.fullName + ' has been registered!</h1><ul><li>Email address: ' + newUser.email +
                             '</li><li>Address: ' + newUser.address + '</li><li>Age: '+ newUser.age + '</li><li>Phone number: ' + newUser.phoneNumber + '</ul>'
                        })
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
        }).lean()
}))

passport.serializeUser( async (user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    try {
        Users.findById(id, done).lean()
    }
    catch (err) {
        errorLog.error({method: req.method, route: req.originalUrl, error: err})
    }
    
})


router.get("/register", getRegister)

router.post("/register", passport.authenticate('register', {failureRedirect: "/accounts/existingcreds"}), postRegister)


router.get("/login", getLogin )

router.post('/login', passport.authenticate('login', {failureRedirect: "/accounts/incorrectcreds"}), postLogin)

router.post("/uploadProfilePic", upload.single("avatar"), uploadProfilePic)

router.get("/profile", isAuth, getProfile)

router.get("/cart", isAuth, getCart)

router.post("/cart/:id", isAuth, addItemToCart)

router.get("/cart/:id/remove", isAuth, removeItemFromCart )

router.get("/cart/purchase", isAuth, purchaseCart)

router.get("/incorrectcreds", getIncorrectCreds )

router.get("/existingcreds", getExistingCreds)

router.get('/logout', logOut)

module.exports = router