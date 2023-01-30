const axios = require('axios')

async function testGetAll(){
    try {
        const response = await axios.get("http://localhost:9000/products")
        console.log(response.data)
    }
    catch (err) {
        console.log(err)
    }
}

async function testGetById(id){
    try {
        const response = await axios.get("http://localhost:9000/products/" + id)
        console.log(response.data)
    }
    catch (err) {
        console.log(err)
    }
}

async function testPostProduct(){
    try {
        const response = await axios.post("http://localhost:9000/products", {
            name: "axios test",
            price: 999,
            description: "testing is good!",
            photo: "an image is worth a thousand words"
        })
        console.log(response.data)
    }
    catch (err) {
        console.log(err)
    }
}

async function testUpdateProduct(id){
    try {
        const response = await axios.put("http://localhost:9000/products/" + id, {
            name: "axios test",
            price: 999,
            description: "testing is good!",
            photo: "replaced"
        })
        console.log(response.data)
    }
    catch (err) {
        console.log(err)
    }
}

async function testDeleteById(id){
    try {
        const response = await axios.delete("http://localhost:9000/products/" + id)
        console.log(response.data)
    }
    catch (err) {
        console.log(err)
    }
}

testGetAll()
testGetById("63c3674b627b8b1a0d7cc9be")
testPostProduct()
testUpdateProduct("63d7e95a3276f8cddfb9febd")
testDeleteById("63d7e95a3276f8cddfb9febd")



