const socket = io()

/* Me traigo los templates y los compilo, listos para pasarles valores y render */
let emptyTemplateProductos = $("#lista-productos").html()
let emptyTemplateMensajes = $("#lista-mensajes").html()
    
let compiledProductos = Handlebars.compile(emptyTemplateProductos)
let compiledMensajes = Handlebars.compile(emptyTemplateMensajes)


socket.on('currentProducts', (data) =>{
    /* render */
    $(".lista-productos").html(compiledProductos({data: data}))

})

socket.on('currentMessages', (mensajes) =>{
    /* render */
    $(".lista-mensajes").html(compiledMensajes({mensajes: mensajes}))

})



/* Cada vez que alguien crea un producto, genero un evento global para actualizar la lista a todos */
let buttonProductos = document.querySelector(".submitProducto")
buttonProductos.addEventListener("click", function(){
    socket.emit('newProduct')
})


/* Cada vez que alguien envia un mensaje, genero un evento global para actualizar la lista a todos */
let buttonMensajes = document.querySelector(".submitMensaje")
buttonMensajes.addEventListener("click", function(){
    let emailValue = document.getElementById("email").value
    let mensajeValue = document.getElementById("mensaje").value
    if(emailValue && mensajeValue){
        let mensaje = {
            correo: emailValue,
            mensaje: mensajeValue
        }
        socket.emit('newMessage', mensaje)
    }
    else{
        alert("Es necesario ingresar un correo electronico y un mensaje para ingresar al chat")
    }
})






