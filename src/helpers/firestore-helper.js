const firebaseAdmin = require('firebase-admin')
const config = require('../db/Config.js')


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(config.firebase)
})


const firedb = firebaseAdmin.firestore()


class firestoreHelper {
    constructor(collection){
        this.collection = firedb.collection(collection)
    }

    async getByID(id){
        const doc = this.collection.doc(id)
        const data = await doc.get()
        const response = data.data()
        return response
    }

    async getAll(){
        const data =  await this.collection.get()
        const response = data.docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            descripcion: doc.data().descripcion,
            precio: doc.data().precio,
            codigo:  doc.data().codigo,
            stock: doc.data().stock,
            thumbnail: doc.data().thumbnail,
            fecha: doc.data().fecha
        }))  
        return response
    }

    async insert(data){
        data.fecha = new Date()
        const doc = this.collection.doc()
        data._id = doc.id
        await doc.create(data)
    }

    async update(id, data){
        data.fecha = new Date()
        const doc = this.collection.doc(id)
        await doc.update(data)
    }

    async delete(id){
        const doc = this.collection.doc(id)
        await doc.delete()
    }

}

module.exports = firestoreHelper