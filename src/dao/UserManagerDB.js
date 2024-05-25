const { usersModel } = require('./models/users.model.js')

class UserManager{
    constructor(){
        this.usersModel = usersModel;
    }
    async getUsers(){
        return await this.usersModel.find().lean()
    }
    async createUser(user){
        return await this.usersModel.create(user)
    }
    async getUser(filter){
        return await this.usersModel.findOne(filter)
    }
}

module.exports = UserManager