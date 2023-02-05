const DAOFactory = require('../DAOs/DAOFactory')
const Products = DAOFactory.getProductDAO()
const getProducts = async function() {
    return await Products.getAll()
}
const getProductById = async function(_id) {
    return await Products.getById(_id)
}
const createProduct = async function({data}) {
    await Products.save(data)
    return data
}
const updateProduct = async function({_id, data}) {
    await Products.updateById(_id, data)
    return data
}
const deleteProduct = async function({_id}) {
    await Products.deleteById(_id)
    return _id
}
module.exports = { getProducts , createProduct, getProductById, updateProduct, deleteProduct}
