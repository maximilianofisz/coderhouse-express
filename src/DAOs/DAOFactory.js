const usersDAO = require('./userDAO')

let userDAO = new usersDAO()


module.exports = class DAOFactory {
    static getUserDAO() {
        return userDAO
    }
}