const mgfactory = require("../helpers/mongooseFactory")
const mongooseFactory = new mgfactory()
const Users = mongooseFactory.create("users")
const Carts = mongooseFactory.create("carts")
const Products = mongooseFactory.create("products")
const mailer = require('../helpers/mailer-helper')
const twilioClient = require('../helpers/twillio-helper')
const pino = require('pino')
const errorLog = pino(pino.destination('./error.log'))

async function getRegister(req, res) {
    res.render("register", {layout: false})
}

async function postRegister(req, res) {
    req.session.save()
    res.redirect("/")
}

async function getLogin(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/")
    }
    else {
        res.render("login", {layout: false})
    }   
}

async function postLogin(req, res) {
    req.session.save()
    res.redirect("/") 
}

async function uploadProfilePic(req, res) {
    res.redirect("/accounts/profile")
}

async function getProfile(req, res) {
    try {
        let user = await Users.findOne({email: req.user.email}).lean()
        res.render('profile', {layout: false, data: {
            email: user.email,
            name: user.fullName,
            address: user.address,
            age: user.age,
            phone_number: user.phoneNumber
        }})
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function getCart(req, res) {
    try {
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
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function addItemToCart(req, res) {
    try {
        let item = await Products.findById(req.params.id).lean()
        let cart = await Carts.findOne({email: req.user.email}).lean()
        cart.items.push(item)
        await Carts.updateOne({email: req.user.email}, {items: cart.items})
        res.redirect("/accounts/cart")
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function removeItemFromCart(req, res) {
    try {
        let item = await Products.findById(req.params.id).lean()
        let cart = await Carts.findOne({email: req.user.email}).lean()
        cart.items.splice(cart.items.findIndex( (cartItem) => {
            return item._id.toString() == cartItem._id.toString() 
        }), 1)
        await Carts.updateOne({email: req.user.email}, {items: cart.items})
        res.redirect("/accounts/cart")
    }
    catch (err) {
        errorLog.error({error: err})
        res.status(500).render("errors", {layout: false})
    }
}

async function purchaseCart(req, res) {
    try {
        let user = await Users.findOne({email: req.user.email}).lean()
        let cart = await Carts.findOne({email: req.user.email}).lean()
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
            to: user.phoneNumber
        })

        res.redirect("/accounts/cart")

    }
    catch (err) {
        errorLog.error({error: err.message})
        res.status(500).render("errors", {layout: false})
    }
}

async function getIncorrectCreds(req, res) {
    res.render("incorrectcreds", {layout: false})
}

async function getExistingCreds(req, res) {
    res.render("existingcreds", {layout: false})
}

async function logOut(req, res) {
    res.render("logout", {data: req.user.email, layout: false})
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
}

module.exports = {getRegister, postRegister, getLogin, postLogin, uploadProfilePic
    , getProfile, getCart, addItemToCart, removeItemFromCart, purchaseCart
, getIncorrectCreds, getExistingCreds, logOut}