const { messageService } = require("../service");

class messageController {
    constructor(){
        this.messageService = messageService
    }
    sendMessage = async (req, res) => {
        const mensaje = req.body; 
        await this.messageService.sendMessage(mensaje)
        res.send("Mensaje enviado")
    }
}

module.exports = { 
    messageController
}