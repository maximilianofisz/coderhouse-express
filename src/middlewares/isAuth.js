function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect("/accounts/login")
    }
}

module.exports = isAuth