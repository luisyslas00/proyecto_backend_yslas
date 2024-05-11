const { cartsModel } = require('./models/carts.model.js')
const { productsModel } = require('./models/products.model.js')

class CartManager{
    constructor(){
        this.cartsModel = cartsModel;
    }
    async getCart(id){
        try{
            const result = await this.cartsModel.find({_id:id})
            return result
        }
        catch(error){
            return {status:'failed', payload:"Carrito no encontrado"}
        }
    }
    async addCart(cart){
        return await this.cartsModel.create(cart)
    }
    async addProduct(cid,pid){
        const searchCart = await this.cartsModel.findOne({"_id":cid})
        searchCart.products.push({product:pid,quantity:1})
        const resp = await this.cartsModel.findByIdAndUpdate({"_id":cid},searchCart)
    }
    async updateCart(cid,pid){
        const searchCart = await this.cartsModel.findById({"_id":cid})
        if(!searchCart) return res.status(404).send({status:"error",error:"Carrito no encontrado"})
        const searchProductDB = await productsModel.findById({"_id":pid})
        const {products} = searchCart
        const searchProduct = products.find(el=>el._id === searchProductDB._id)
        console.log(products)
        console.log(searchProductDB)
        const {_id} = searchProductDB
        const myProducts = {
            _id,
            quantity:1
        }
        if(searchProduct){
            searchProduct.quantity +=1
        }else{
            products.push(myProducts)
        }
        return await this.cartsModel.updateOne({_id:cid},searchCart)
    }
    async deleteCart(id){
        return await this.cartsModel.deleteOne({_id:id})
    }
}

module.exports = CartManager