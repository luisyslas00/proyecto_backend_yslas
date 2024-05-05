const { productsModel } = require('./models/products.model.js')

class ProductManager{
    constructor(){
        this.productsModel = productsModel;
    }
    async getProducts(){
        return await this.productsModel.find()
    }
    async addProduct(objeto){
        const products = await this.productsModel.find()
        const {title,description,price,thumbnail,code,stock} = objeto
        objeto.status = true
        if(title===""||description===""||price===0||thumbnail===""||code===""||stock===0){
            return {status:'failed', payload:"Rellenar correctamente los campos"}
        }
        let repite = products.some(elemento=>{
            return elemento.code === code
        })
        if(repite){
            return {status:'failed', payload: "Código repetido"}
        }else{
            return await this.productsModel.create(objeto)
        }
    }
    async updateProduct(id,objeto){
        const {title,description,price,thumbnail,code,stock} = objeto
        const products = await this.productsModel.find()
        if(!title, !description,!price,!thumbnail,!code,!stock){
            return {status:'failed',payload:'Faltan campos'}
        }
        return await this.productsModel.updateOne({_id:id},objeto)
    }
    async deleteProduct(id){
        return await this.productsModel.deleteOne({_id:id})
    }
    async getProductById(id){
        return await this.productsModel.find({_id:id})
    }
}

module.exports = ProductManager