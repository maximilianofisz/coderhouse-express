const request = require('supertest')
const app = require('../../src/main')
const expect = require("chai").expect
const faker = require("faker")
const { get } = require('mongoose')

function getProduct() {
    return {
        name: faker.commerce.product(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        photo: faker.commerce.color()
    }
}

describe("Testing the products API", () => {
    describe("GET", () => {
        it("Should return status 200", async () => {
            request(app).get("/products").expect(200)
        })
    })
    describe("GET", () => {
        it("Should return the product with the ID requested", async () => {
            let response = await request(app).get("/products/" + "63c0c17612b5be04f8c3cf89")
            expect(response.status).to.eql(200)
            expect(response.body).to.eql({"_id":"63c0c17612b5be04f8c3cf89","name":"a","price":1,"description":"a","photo":"a","__v":0})
        })
    })
    describe("POST", () => {
        it("Should return the newly created product", async () => {
            let newProduct = getProduct()
            let response = await request(app).post("/products").send(newProduct)
            expect(response.status).to.eql(200)
            let savedProduct = response.body
            expect(newProduct.name).to.eql(savedProduct.name)
            expect(newProduct.description).to.eql(savedProduct.description)
            expect(newProduct.price).to.eql(savedProduct.price)
            expect(newProduct.photo).to.eql(savedProduct.photo)
        })
    })
    describe("PUT", () => {
        it("Should return modified product", async () => {
            let newProduct = get()
            await request(app).post("/products").send(newProduct)
            let allProducts = await request(app).get("/products")
            lastProduct = allProducts.body[allProducts.body.length - 1]
            console.log(lastProduct)
            await request(app).put("/products/" + lastProduct._id).send({
                name: lastProduct.name,
                description: lastProduct.description,
                price: lastProduct.price,
                photo: "mochatest"
            })
            let updatedReq = await request(app).get("/products/" + lastProduct._id)
            let updatedProduct = updatedReq.body
            expect(lastProduct.name).to.eql(updatedProduct.name)
            expect(lastProduct.description).to.eql(updatedProduct.description) 
            expect(lastProduct.price).to.eql(updatedProduct.price)
            expect(updatedProduct.photo).to.eql("mochatest")
        })
    })
    describe("DELETE", () => {
        it("Should delete a product", async () => {
            let newProduct = get()
            await request(app).post("/products").send(newProduct)
            let allProducts = await request(app).get("/products")
            lastProduct = allProducts.body[allProducts.body.length - 1]
            await request(app).delete("/products/" + lastProduct._id)
            let deletedReq = await request(app).get("/products/" + lastProduct._id)
            let deletedProduct = deletedReq.body
            console.log(deletedProduct)
            expect(deletedProduct).to.eql({})
        })
    })

})