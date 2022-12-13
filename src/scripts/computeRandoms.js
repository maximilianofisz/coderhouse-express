process.on("message", msg => {
    let data = {}
    for(let i = 0; i < msg; i++){
        let random = Math.floor(Math.random() * 1001)
    
        if(data[random]){
            data[random]++
        }
        else {
            data[random] = 1
        }

    }
    process.send(data)
    process.exit(0)
})

