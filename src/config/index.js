const { connect } = require('mongoose')

const connectDB = () => {
    connect('mongodb+srv://yslasluis92:QFEiu38g79brJ7PS@ecommerceyslas.m5qjthp.mongodb.net/coderYslas?retryWrites=true&w=majority&appName=EcommerceYslas')
    console.log('Base de datos conectada')
}

module.exports = {
    connectDB
}