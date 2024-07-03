const { Router } = require('express')
const { uploader } = require('../utils/multer.js')
const ProductDaoMongo = require('../dao/MONGO/productDao.mongo.js')
const CartDaoMongo = require('../dao/MONGO/cartDao.mongo.js')
const MessageDaoMongo = require('../dao/MONGO/messageDao.mongo.js')

const cartManager = new CartDaoMongo()
const messageManager = new MessageDaoMongo()
const productManager = new ProductDaoMongo()

const router = Router()

router.get('/',(req,res)=>{
    res.render('index',{
        title:"Home | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID,
        user:req.session?.user?.first_name,
    })
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
            messages,
            styles:'styles.css',
            cartID:req.session?.user?.cartID,
            user:req.session?.user?.first_name,
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
        styles:'styles.css',
        user:req.session?.user?.first_name,
        cartID:req.session?.user?.cartID,
    })
})

router.get('/carts/:cid',async(req,res)=>{
    const {cid}=req.params
    const cart = await cartManager.getCart(cid)
    const products = cart.products
    res.render("carts",{
        products:products,
        styles:'styles.css',
        cartID:req.session?.user?.cartID,
        user:req.session?.user?.first_name,
    })
})

router.get('/login',async(req,res)=>{
    res.render("login",{
        title:"Iniciar Sesión | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID
    })
})

router.get('/register',async(req,res)=>{
    res.render("register",{
        title:"Registrarse | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID
    })
})

module.exports = router