const DAOFactory = require('../DAOs/DAOFactory')
const Messages = DAOFactory.getMsgDAO()

async function getChat(req, res) {
    
    res.render("chat", {layout: false, fullName: req.user.fullName, email: req.user.email})
}

async function getOwnMessages(req, res) {
    let messages = await Messages.getAllMsgs(req.params.email)
    console.log(messages)
    res.render("chatFiltered", {layout: false, requested: req.params.email, fullName: req.user.fullName, data: messages})
}

module.exports = { getChat, getOwnMessages }