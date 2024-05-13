const { cartsModel } = require('./models/carts.model.js')
const { productsModel } = require('./models/products.model.js')


class CartManager{
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
        // const result = await this.cartsModel.updateOne({ _id: cid, "products.product._id": pid }, { $set: { "products.quantity": newQuantity } });
        // return result
        const cart = await this.cartsModel.findById(cid); // Suponiendo que estás utilizando Mongoose
        const productIndex = cart.products.findIndex(product => product.product === pid);
        // Si el producto existe en el carrito, actualiza su cantidad
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity;
            await cart.save();
        }
    }
}

module.exports = CartManager

// async updateCart(cid,pid){
//     const searchCart = await this.cartsModel.findById({"_id":cid})
//     if(!searchCart) return res.status(404).send({status:"error",error:"Carrito no encontrado"})
//     const searchProductDB = await productsModel.findById({"_id":pid})
//     const {products} = searchCart
//     const searchProduct = products.find(el=>el._id === searchProductDB._id)
//     console.log(products)
//     console.log(searchProductDB)
//     const {_id} = searchProductDB
//     const myProducts = {
//         _id,
//         quantity:1
//     }
//     if(searchProduct){
//         searchProduct.quantity +=1
//     }else{
//         products.push(myProducts)
//     }
//     return await this.cartsModel.updateOne({_id:cid},searchCart)
// }