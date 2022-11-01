const firestoreHelper = require('../../helpers/firestore-helper.js')

class carritoFirestoreDto extends firestoreHelper {
    constructor(){
        super("carritos")
    }
}

module.exports = carritoFirestoreDto