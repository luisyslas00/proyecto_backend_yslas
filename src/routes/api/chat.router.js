const { Router } = require('express');
const { messageController } = require('../../controller/messages.controller');

const router = Router()

const {sendMessage} = new messageController()

router.post('/', sendMessage);

module.exports = router
