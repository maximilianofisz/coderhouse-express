const usersDAO = require('./userDAO')
const cartsDAO = require('./cartDAO')
const productsDAO = require('./productDAO')
const msgsDAO = require('./msgDAO')

let userDAO = new usersDAO()
let cartDAO = new cartsDAO()
let productDAO = new productsDAO()
let msgDAO = new msgsDAO()

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
}