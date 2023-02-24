const usersDAO = require('./userDAO')
const cartsDAO = require('./cartDAO')
const productsDAO = require('./productDAO')
const msgsDAO = require('./msgDAO')
const ordersDAO = require('./orderDAO')
const conversationsDAO = require("./conversationDAO")

let userDAO = new usersDAO()
let cartDAO = new cartsDAO()
let productDAO = new productsDAO()
let msgDAO = new msgsDAO()
let orderDAO = new ordersDAO() 
let conversationDAO = new conversationsDAO()

module.exports = class DAOFactory {
    static getUserDAO() {
        return userDAO
    }
    static getCartDAO() {
        return cartDAO
    }
    static getProductDAO() {
        return productDAO
    }
    static getMsgDAO() {
        return msgDAO
    }
    static getOrderDAO() {
        return orderDAO
    }
    static getConversationDAO(){
        return conversationDAO
    }
}