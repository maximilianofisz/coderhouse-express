const socket = io()

/* Me traigo el template y lo compilo, listo para pasarle valores y render */
let emptyTemplate = $("#lista-productos").html()
    
let compiled = Handlebars.compile(emptyTemplate)


socket.on('currentProducts', (data) =>{
    /* render */
    $(".lista-productos").html(compiled({data: data}))

})

/* Cada vez que alguien crea un producto, genero un evento global actualizar la lista a todos */
let button = document.querySelector(".submit")
button.addEventListener("click", function(){
    socket.emit('newProduct')
})






