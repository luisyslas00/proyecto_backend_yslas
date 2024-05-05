const { Schema, model } = require('mongoose')

const productsSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    status:Boolean,
    code:{
        type: String,
        unique: true
    },
    stock:Number
})

const productsModel = model('products',productsSchema)

module.exports = {
    productsModel
}