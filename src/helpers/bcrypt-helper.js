const bcrypt = require('bcrypt')

class bcryptHelper{
    checkPassword(hashedPassword, password){
        return bcrypt.compareSync(password, hashedPassword)
    }
    
    hashPassword(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }
}

module.exports = bcryptHelper