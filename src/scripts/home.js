const socket = io()

socket.connect()

/* Me traigo los templates y los compilo, listos para pasarles valores y render */

async function fetchAndRender(data){
    const response = await fetch("./home_products.hbs")
    const template = await response.text()
    const dataCompile = Handlebars.compile(template)
    const result = dataCompile(data)
    return result
}

socket.on('currentProducts', async (data) =>{
    /* render */
    /* $(".list-products").html(compiledProducts({data: data})) */
    const productList = document.querySelector("#list-products")
    const newContent = await fetchAndRender(data)
    productList.innerHTML = newContent 

})

/* socket.on('currentMsgs', (msgs) =>{

    console.log(msgs)
    $(".list-msgs").html(compiledMsgs({msgs: msgs}))

}) */


/* let buttonMensajes = document.querySelector(".submitMensaje")
buttonMensajes.addEventListener("click", function(){
    let msgValue = document.getElementById("msg").value
    let msg = {
        text: msgValue,
        author: {
            id: user._id,
            email: user.email
        }
    }
    socket.emit("newMsg", msg)
})
 */

let submitProduct = document.querySelector(".createProductBtn")
submitProduct.addEventListener("click", function(){
    let name = document.getElementById("name").value
    let price = document.getElementById("price").value
    let desc = document.getElementById("description").value
    let photo = document.getElementById("photo").value
    console.log(name)

    if (name == "" || price == "" || desc == "" || photo == ""){
        alert("Please complete information about new product")
    }
    else {
        let product = {
            name: name,
            price: price,
            description: desc,
            photo: photo        
            }
        console.log(product)
        socket.emit("newProduct", product)
        }
    }
)


function addToCart(btn){
    socket.emit("addCart", btn.id)
    alert("Product added to cart!")
}

let cartBtns = document.querySelectorAll(".cartBtn")
cartBtns.forEach(btn => {
    btn.addEventListener("click", addToCart())
})



