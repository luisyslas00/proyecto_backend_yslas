const { cartsModel } = require('./models/carts.model.js')
const { productsModel } = require('./models/products.model.js')


class CartDaoMongo{
    constructor(){
        this.cartsModel = cartsModel;
    }
    async getCart(id){
        try{
            const result = await this.cartsModel.findOne({_id:id}).lean()
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
        try{
            const searchCart = await this.cartsModel.findOne({"_id":cid})
            //Queda verificar si el producto existe en la base de datos
            let productExist=false
            if(searchCart){
                for(const cartProduct of searchCart.products){
                    if(cartProduct.product._id.toString()===pid){
                        cartProduct.quantity++;
                        productExist=true
                        break
                    }
                }
                if(!productExist){
                    searchCart.products.push({product:pid,quantity:1})
                }
            }
            const resp = await this.cartsModel.findByIdAndUpdate({"_id":cid},searchCart)
            return resp
        }
        catch(error){
            return {status:'failed', payload:"Error al agregar el producto"}
        }
    }
    async deleteCart(id){
        try{
            const searchCart = await this.cartsModel.findOne({"_id":id})
            searchCart.products = []
            return await this.cartsModel.findByIdAndUpdate({_id:id},searchCart)
        }
        catch(error){
            return {status:'failed', payload:"Error al eliminar el carrito"}
        }
    }
    async deleteProduct(cid,pid){
        try{
            const result =  await this.cartsModel.updateOne({ _id: cid }, { $pull: { products: { product:{_id: pid} } } });
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al eliminar el producto"}
        }
    }
    async updateCart(cid,newProducts){
        try{
            const result = await this.cartsModel.updateOne({ _id: cid }, { $set: { products: newProducts } })
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al actualizar el carrito"}
        }
    }
    async updateQuantity(cid,pid,newQuantity){
        try{
            const cart = await this.cartsModel.findById(cid);
            let productExist=false
            if(cart){
                for(const cartProduct of cart.products){
                    if(cartProduct.product._id.toString()===pid){
                        cartProduct.quantity+=Number(newQuantity);
                        productExist=true
                        break
                    }
                }
                if(!productExist){
                    cart.products.push({product:pid,quantity:Number(newQuantity)})
                }
            }
            const result = await this.cartsModel.findByIdAndUpdate({"_id":cid},cart)
            console.log(result)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al actualizar la cantidad"}
        }
    }
}

module.exports = CartDaoMongo