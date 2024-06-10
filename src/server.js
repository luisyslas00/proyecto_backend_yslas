//Importamos
const express = require('express')
const handlebars = require('express-handlebars')
const viewsRouter = require('./routes/views.router.js')
const { connectDB } = require('./config/index.js')
const productsRouter = require('./routes/api/products.router.js')
const cartsRouter = require('./routes/api/carts.router.js')
const chatRouter = require('./routes/api/chat.router.js')
const sessionsRouter = require('./routes/api/sessions.router.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const { initializePassportGithub } = require('./config/passportgithub.config.js')
//Websocket
const { Server } = require('socket.io')
const ProductManager = require('./dao/ProductManagerDB.js')

const productManager = new ProductManager()

const app = express()
//Establecemos el puerto
const PORT = process.env.PORT || 8080

//Importante la configuración
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
//Cookie Parser
app.use(cookieParser())
// app.use(session({
//     secret:'s3cr3t0Y',
//     resave:true,
//     saveUninitialized:true
// }))

//Configuración Socket
const httpServer = app.listen(PORT,error=>{
    if(error) return console.log(error)
    console.log("Server escuchando")
})
const io = new Server(httpServer)

//Session con MONGODB
// app.use(session({
//     store:MongoStore.create({
//         mongoUrl:'mongodb+srv://yslasluis92:QFEiu38g79brJ7PS@ecommerceyslas.m5qjthp.mongodb.net/coderYslas?retryWrites=true&w=majority&appName=EcommerceYslas',
//         mongoOptions: {
//             useNewUrlParser:true,
//             useUnifiedTopology:true,
//         },
//         ttl:60*60*1000*3,
//     }),
//     secret:'s3cr3t0Y',
//     resave:true,
//     saveUninitialized:true
// }))
//Passport
initializePassport()
initializePassportGithub()
app.use(passport.initialize())
// app.use(passport.session())

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
// app.use(productsSocket(io))
app.use('/',viewsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/chat',chatRouter)
app.use('/api/sessions',sessionsRouter)



//Escuchamos el servidor
app.use((error,req,res,next)=>{
    console.log(error)
    res.status(500).send('Error 500 en el server')
    return next()
})

// mongodb+srv://yslasluis92:<password>@ecommerceyslas.m5qjthp.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceYslas