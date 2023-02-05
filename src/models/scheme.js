const { buildSchema } = require('graphql')

var schema = buildSchema(`
type Product {
    _id: String,
    name: String,
    price: Int,
    description: String,
    photo: String
}

input productInput {
    name: String!,
    price: Int!,
    description: String!,
    photo: String!
}

type Query {
    getProducts: [Product]
    getProductById(_id: String!): Product
}

type Mutation {
    createProduct(data: productInput): Product
    updateProduct(_id: String!, data: productInput!): Product
    deleteProduct(_id: String!): String
}
`)

module.exports = schema