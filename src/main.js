const express = require('express')
const productosRouter = require('./routes/productos.js')
const app = express()

//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})

app.use(productosRouter)




app.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




