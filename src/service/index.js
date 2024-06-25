const CartManager = require("../dao/CartManagerDB");
const MessageManager = require("../dao/MessageManagerDB");
const ProductManager = require("../dao/ProductManagerDB");
const UserManager = require("../dao/UserManagerDB");

const cartService = new CartManager()
const messageService = new MessageManager()
const productService = new ProductManager()
const userService = new UserManager()

module.exports = {
    cartService,
    messageService,
    productService,
    userService
}