const jwt = require('jsonwebtoken')
const { objectConfig } = require('../config/config.js')
const {private_key} = objectConfig

const generateToken = user => jwt.sign(user,private_key,{expiresIn:'24h'})


module.exports = {
    generateToken
}