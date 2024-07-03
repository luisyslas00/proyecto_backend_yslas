const { objectConfig } = require("../config/config.js");



switch (objectConfig.persistence) {
    case "FS":
        const CartDaoFile = require("./FS/CartManagerFS.js").default;
        CartDao = CartDaoFile
        const ProductDaoFile = require("./FS/ProductManagerFS.js").default;
        ProductDao = ProductDaoFile
        break;
    default:
        const {default:ProductDaoMongo} = require("./MONGO/productDao.mongo.js");
        ProductDao = ProductDaoMongo
        const {default:CartDaoMongo} = require("./MONGO/cartDao.mongo");
        CartDao = CartDaoMongo
        const {default:UserDaoMongo} = await import("./MONGO/userDao.mongo.js");
        let UserDao = new UserDaoMongo()
        console.log(UserDao)
        module.exports = UserDao
        const {default:MessageDaoMongo} = require("./MONGO/messageDao.mongo.js");
        MessageDao = MessageDaoMongo
        break;
}
// console.log(UserDao)
// module.exports = {
//     ProductDao:ProductDao,
//     CartDao:CartDao,
//     UserDao:UserDao,
//     MessageDao:MessageDao
// }