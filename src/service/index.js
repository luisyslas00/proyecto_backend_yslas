const CartDaoMongo = require("../dao/MONGO/cartDao.mongo.js");
const MessageDaoMongo = require("../dao/MONGO/messageDao.mongo.js");
const ProductDaoMongo = require("../dao/MONGO/productDao.mongo.js");
const UserDao = require("../dao/factory.js");

const UserRepository = require("../repositories/user.repository.js");

const cartService = new CartDaoMongo()
const messageService = new MessageDaoMongo()
const productService = new ProductDaoMongo()
const userService = new UserRepository(new UserDao())

module.exports = {
    cartService,
    messageService,
    productService,
    userService
}