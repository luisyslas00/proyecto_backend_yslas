const { Router } = require('express')
const MessageManager = require('../../dao/MessageManagerDB.js')

const messageManager = new MessageManager()
const router = Router()

router.post('/', async (req, res) => {
    const mensaje = req.body; 
    await messageManager.sendMessage(mensaje)
    res.send("Mensaje enviado")
});

module.exports = router
