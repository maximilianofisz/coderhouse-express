const socket = io()


/* Me traigo los templates y los compilo, listos para pasarles valores y render */
let emptyTemplateProducts = $("#list-products").html()
let emptyTemplateName = $("#username").html()

let compiledProducts = Handlebars.compile(emptyTemplateProducts)
let compiledName = Handlebars.compile(emptyTemplateName)

socket.on('currentData', (data) =>{
    /* render */
    $(".username").html(compiledName({name: data}))
})

socket.on('currentProducts', (data) =>{
    /* render */
    $(".list-products").html(compiledProducts({data: data}))
})


/* Cada vez que alguien crea un producto, genero un evento global para actualizar la lista a todos */
let buttonProductos = document.querySelector(".createProductBtn")
buttonProductos.addEventListener("click", function(){
    socket.emit('newProduct')
})


function logOut(){
    window.location = "/logout"
}
let logOutBtn = document.querySelector('.btnLogout')
logOutBtn.addEventListener('click', logOut)


