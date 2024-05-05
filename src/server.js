//Importamos
const express = require('express')
const handlebars = require('express-handlebars')
const viewsRouter = require('./routes/views.router.js')
const { connectDB } = require('./config/index.js')
const productsRouter = require('./routes/api/products.router.js')
const cartsRouter = require('./routes/api/carts.router.js')
const chatRouter = require('./routes/api/chat.router.js')

const app = express()

//Establecemos el puerto
const PORT = process.env.PORT || 8080

//Importante la configuración
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//Configurando hbs
app.engine('hbs',handlebars.engine({
    extname:'.hbs'
}))
app.set('views',__dirname+'/views')
app.set('view engine','hbs')

connectDB()

//Endpoint
//url-base/products -> plantilla
//url-base/api/products -> json

app.use('/',viewsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/chat',chatRouter)

//Escuchamos el servidor
app.listen(PORT,err=>{
    if(err) console.log(`Error: ${err}`)
    console.log(`Escuchando en ${PORT}`)
})

// mongodb+srv://yslasluis92:<password>@ecommerceyslas.m5qjthp.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceYslas