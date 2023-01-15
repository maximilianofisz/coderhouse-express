const express = require('express')
const router = express.Router()
const fs = require('fs')
const session = require('express-session')
const { Mongoose, default: mongoose } = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mailer = require('../helpers/mailer.js')
const twilioClient = require('../helpers/twillio-helper')
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


const Msgs = require('../helpers/msgsHelper.js')
const Products = require('../helpers/productsHelper.js')
const Users = require('../helpers/usersHelper.js')
const Carts = require("../helpers/cartsHelper.js")


function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect("/accounts/login")
    }
}


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
    let user = await Users.findOne({email: req.user.email}).lean()
    res.render('profile', {layout: false, data: {
        email: user.email,
        name: user.fullName,
        address: user.address,
        age: user.age,
        phone_number: user.phoneNumber
    }})
})

router.get("/cart", isAuth, async (req, res) => {
    let user = await Users.findOne({email: req.user.email}).lean()
    let cart = await Carts.findOne({email: req.user.email}).lean()
    let total = 0
    cart.items.forEach( (item) => {
        total = total + item.price
    })
    res.render('cart', {layout: false, data: {
        cart: cart.items,
        user: user.fullName,
        total: total
    }})
})

router.post("/cart/:id", isAuth, async (req, res) => {
    let item = await Products.findById(req.params.id).lean()
    let cart = await Carts.findOne({email: req.user.email}).lean()
    cart.items.push(item)
    await Carts.updateOne({email: req.user.email}, {items: cart.items})
    res.redirect("/accounts/cart")
})

router.get("/cart/:id/remove", isAuth, async (req, res) => {
    let item = await Products.findById(req.params.id).lean()
    let cart = await Carts.findOne({email: req.user.email}).lean()
    cart.items.splice(cart.items.findIndex( (cartItem) => {
        return item._id.toString() == cartItem._id.toString() 
    }), 1)

    
    await Carts.updateOne({email: req.user.email}, {items: cart.items})
    res.redirect("/accounts/cart")
})

router.get("/cart/purchase", isAuth, async (req, res) => {
    let cart = await Carts.findOne({email: req.user.email}).lean()
    let user = await Users.findOne({email: req.user.email}).lean()
    let total = 0
    cart.items.forEach( (item) => {
        total = total + item.price
    })

    let bought = ''

    cart.items.forEach( (item) => {
        bought = bought + `<li>${item.name + ' $' + item.price}</li>`
    })
    await Carts.updateOne({email: req.user.email}, {items: []})


    mailer.sendMail({
        from: 'Node Server',
        to: process.env.ADMIN_MAIL_ADDRESS,
        subject: "New purchase from " + user.fullName + ` (${user.email})`,
        html: `User has bought the following items, for a total of $${total}:
                <br>
                <ul>${bought}</ul`
    })
    

    await twilioClient.messages.create({
        body: "New purchase from " + user.fullName + ` (${user.email})`,
        from: "whatsapp:"+process.env.TWILIO_FROM_WPP,
        to: "whatsapp:"+user.phoneNumber
    })

    await twilioClient.messages.create({
        body: "Your purchase was registered correctly",
        from: process.env.TWILIO_FROM_SMS,
        to: "9"+user.phoneNumber
    })
    res.redirect("/accounts/cart")

})


router.get("/incorrectcreds", async (req, res) => {
    res.render("incorrectcreds", {layout: false})
})

router.get("/existingcreds", async (req, res) => {
    res.render("existingcreds", {layout: false})
})

router.get('/logout', async (req, res) => {
    console.log(req.user)
    res.render("logout", {data: req.user.email, layout: false})
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
})

module.exports = router