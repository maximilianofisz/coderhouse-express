const socket = io()


/* Me traigo los templates y los compilo, listos para pasarles valores y render */
let emptyTemplateMsgs = $("#list-msgs").html()
let emptyTemplateProducts = $("#list-products").html()
let emptyTemplateName = $("#email").html()

let compiledMsgs = Handlebars.compile(emptyTemplateMsgs)
let compiledProducts = Handlebars.compile(emptyTemplateProducts)
let compiledName = Handlebars.compile(emptyTemplateName)

let user

socket.on('currentUser', (data) =>{
    /* render */
    user = data
    $(".email").html(compiledName({name: user.email}))
    $("#profilePicFrame").attr("src", "http://localhost:9000/" + user.email + ".png")
})

socket.on('currentProducts', (data) =>{
    /* render */
    $(".list-products").html(compiledProducts({data: data}))
})

socket.on('currentMsgs', (msgs) =>{

    console.log(msgs)
    $(".list-msgs").html(compiledMsgs({msgs: msgs}))

})



/* Cada vez que alguien crea un producto, genero un evento global para actualizar la lista a todos */
let buttonProductos = document.querySelector(".createProductBtn")
buttonProductos.addEventListener("click", function(){
    socket.emit('newProduct')
})

let buttonMensajes = document.querySelector(".submitMensaje")
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

document.getElementById("profilePic").onchange = function() {
    document.getElementById("profilePicSubmit").submit()
}


function logOut(){
    window.location = "/accounts/logout"
}
let logOutBtn = document.querySelector('.btnLogout')
logOutBtn.addEventListener('click', logOut)


