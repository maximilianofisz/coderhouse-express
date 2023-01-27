async function getHome(req, res) {
    res.render("home", {layout: false, fullName: req.user.fullName})
}

module.exports = { getHome }