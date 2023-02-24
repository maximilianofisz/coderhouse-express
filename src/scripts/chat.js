const socket = io()

socket.connect()

async function fetchAndRender(data){
    const response = await fetch("./chat_conversations.hbs")
    const template = await response.text()
    const dataCompile = Handlebars.compile(template)
    const result = dataCompile(data)
    return result
}


let createConversationBtn = document.getElementById("createConversationBtn")
createConversationBtn.addEventListener("click", () => {
    let msg = document.getElementById("firstMsg").value
    let author = document.getElementById("emailSender").innerHTML
    let data = {
        msg: msg,
        author: author
    }
    socket.emit("newConvo", data)
})

socket.on("currentConversations", async (data) => {

    const conversationList = document.getElementById("conversationsList")
    const newContent = await fetchAndRender(data)
    conversationList.innerHTML = newContent


    let replyBtns = document.querySelectorAll(".reply")
    replyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            let replyBox = document.getElementById("reply_"+btn.id)
            /* console.log(replyBox.attributes.type) */
            if(replyBox.attributes.type.value === "hidden") {
                replyBox.setAttribute("type", "text")
            }
            else {
                let author = document.getElementById("emailSender").innerHTML
                let msg = document.getElementById("reply_"+btn.id).value
                let message = {
                    _id: btn.id,
                    author: author,
                    msg: msg
                }
                socket.emit("newMsg", message)
            }

        })
    });
})

