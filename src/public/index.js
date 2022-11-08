const socket = io()

const authorSchema = new normalizr.schema.Entity("authors")
const msgSchema = new normalizr.schema.Entity("msgs") 
const dataSchema = new normalizr.schema.Entity("data", {
    author: authorSchema,
    msgs: [msgSchema]
})



/* Me traigo los templates y los compilo, listos para pasarles valores y render */
let emptyTemplateProductos = $("#lista-productos").html()
let emptyTemplateMensajes = $("#lista-mensajes").html()
    
let compiledProductos = Handlebars.compile(emptyTemplateProductos)
let compiledMensajes = Handlebars.compile(emptyTemplateMensajes)


socket.on('currentProducts', (data) =>{
    /* render */
    $(".lista-productos").html(compiledProductos({data: data}))

})

socket.on('currentMessages', (msgs) =>{
    /* render */
    let data = normalizr.denormalize(msgs.result, dataSchema, msgs.entities )
    let compressText = document.querySelector(".compress")
    let compressLevel = (100 - (JSON.stringify(data).length * 100) / JSON.stringify(msgs).length).toPrecision(3)
    compressText.innerText = "CHAT (" + compressLevel + "% comprimido)"


    $(".lista-mensajes").html(compiledMensajes({msgs: data.msgs}))

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
    let nameValue = document.getElementById("name").value
    let lastNameValue = document.getElementById("lastname").value
    let ageValue = document.getElementById("age").value
    let usernameValue = document.getElementById("username").value
    let avatarValue = document.getElementById("avatar").value
    let msgValue = document.getElementById("msg").value


    if(emailValue && nameValue && lastNameValue && ageValue && usernameValue && avatarValue && msgValue){
        let msg = {
            text: msgValue,
            author: {
                id: emailValue,
                name: nameValue,
                lastname: lastNameValue,
                age: ageValue,
                username: usernameValue,
                avatar: avatarValue
            }
        }
        socket.emit('newMessage', msg)
    }
    else{
        alert("Es necesario ingresar todos los datos del formulario para enviar un mensaje")
    }
})






