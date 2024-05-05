const { Schema, model} = require('mongoose')

const cartsSchema = new Schema({
    products: Array
})

const cartsModel = model('carts',cartsSchema)

module.exports = {
    cartsModel
}