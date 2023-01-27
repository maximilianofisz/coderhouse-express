const express = require('express')
const router = express.Router()

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const BcryptHelper = require('../helpers/bcrypt-helper')
const bcryptHelper = new BcryptHelper()
const { multerConfig } = require('../config/multerConfig')

const upload = multerConfig
const mailer = require('../helpers/mailer-helper')
const pino = require('pino')
const logInformation = require('../middlewares/logInformation') 
const errorLog = pino(pino.destination('./error.log'))
router.use(logInformation)

const isAuth = require('../middlewares/isAuth')

const DAOsFactory = require('../DAOs/DAOFactory')

const Users = DAOsFactory.getUserDAO()
const Carts = DAOsFactory.getCartDAO()

const { getRegister, postRegister, getLogin, postLogin, uploadProfilePic
, getProfile, getCart, addItemToCart, removeItemFromCart, purchaseCart,
getIncorrectCreds, getExistingCreds, logOut } = require('../controllers/accountsController')


passport.use('login', new LocalStrategy({usernameField: 'email'},
    async (email, password, done) => {
        try {
            let user = await Users.getOne({email: email})
            
            if (!user) {
                console.log("user not found")
                return done(null, false)
            }
            if (!bcryptHelper.checkPassword(user.password, password)){
                return done(null, false)
            }
            console.log(user)
            return done(null, user)
        }
        catch (err) {
            errorLog.error({error: err})
            return done(err)
        }
    }
))

passport.use('register', new LocalStrategy({usernameField: 'email', passwordField: 'password', passReqToCallback: true},
    async (req, email, password, done) => {
        try {
            let user = await Users.getOne({email: email})
            if (user) {
                errorLog.error({error: "Credentials already exist"})
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
                try {
                    let user = await Users.save(newUser)
                    Carts.save({
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
                    return done(null, user)
                }
                catch (err) {
                    errorLog.error({error: err})
                    return done(err)
                }
            }
        }
        catch (err){
            errorLog.error({error: err})
            return done(err)
        }
   
}))

passport.serializeUser( async (user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        let user = await Users.getById(id)
        if (user) return done(null, user)
    }
    catch (err) {
        errorLog.error({error: err})
        return done(err)
    }
    
})


router.get("/register", getRegister)

router.post("/register", upload.single("avatar"), passport.authenticate('register', {failureRedirect: "/accounts/existingcreds"}), postRegister)


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