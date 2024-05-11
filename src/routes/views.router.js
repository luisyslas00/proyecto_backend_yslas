const { Router } = require('express')
const { uploader } = require('../utils/multer')
const MessageManager = require('../dao/MessageManagerDB.js')
const ProductManager = require('../dao/ProductManagerDB.js')

const messageManager = new MessageManager()
const productManager = new ProductManager()

const router = Router()

router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/upload-file',uploader.single('myFile'),(req,res)=>{
    res.render('successFile')
})

router.get("/chat",async(req,res)=>{
    try{
        //Traer el chat
        const messages = await messageManager.getMessages()
        res.render("chat",{
            title:'Chat | Tienda',
            messagesExiste:messages.length!==0,
            messages
        })
    }
    catch(error){
        console.log(error)
    }
})

router.get("/products",async(req,res)=>{
    const {newPage,limit,ord} = req.query
    const {docs, totalPages,page,hasPrevPage,hasNextPage,prevPage,nextPage} = await productManager.getProducts({newPage,limit,ord})
    res.render("products",{
        title:"Productos | Tienda",
        products:docs,
        productsExist:docs.length!==0,
        page,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        styles:'styles.css'
    })
})
//Aquí agrego las vistas de mi página.
//Para login, register, cart, details product, etc.
module.exports = router