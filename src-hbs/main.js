const express = require('express')
const productosRouter = require('./routes/productos.js')
const handlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')


app.engine("hbs",
 handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

app.set("view engine", "hbs")

app.set("views", __dirname + "/views")


//Log time and request
app.use((req, res, next) => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), req.method, req.originalUrl)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('src-hbs/public'))
app.use(productosRouter)




app.listen(8080, ()=>{
    console.log("App started and listening on port 8080 :)")
})




