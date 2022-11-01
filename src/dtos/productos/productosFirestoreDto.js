const firestoreHelper = require('../../helpers/firestore-helper.js')

class carritoFirestoreDto extends firestoreHelper {
    constructor(collection){
        super("productos")
    }
}

module.exports = carritoFirestoreDto