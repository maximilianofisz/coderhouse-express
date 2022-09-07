const express = require('express')
const productosRouter = require('./routes/productos.js')
const app = express()
const bodyParser = require('body-parser')

//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('src/public'))
app.use('/api/productos', productosRouter)




app.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




