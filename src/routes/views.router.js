const { Router } = require('express')
const { uploader } = require('../utils/multer')
const MessageManager = require('../dao/MessageManagerDB.js')

const messageManager = new MessageManager()

const router = Router()

router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/upload-file',uploader.single('myFile'),(req,res)=>{
    res.render('successFile')
})

// router.post('/enviar-mensaje', async (req, res) => {
//     const mensaje = req.body.mensaje; 
//     await messageManager.sendMessage(mensaje)
//     res.send("Mensaje enviado")
// });


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
//Aquí agrego las vistas de mi página.
//Para login, register, cart, details product, etc.
module.exports = router