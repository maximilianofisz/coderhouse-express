async function getHome(req, res) {
    data = {
        user: req.user
    } 
    res.render("home", {layout: false, data: data})
}

module.exports = { getHome }