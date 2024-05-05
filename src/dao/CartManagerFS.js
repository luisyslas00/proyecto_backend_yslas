const fs = require('fs')
const path = './carts.json'

class CartManager{
    #carts
    constructor(path){
        this.#carts = []
        this.path = path
    }
    async addCart(cart){
        try{
            this.#carts = await this.leerArchivo()
            this.#carts.push(cart)
            this.guardarArchivo()
        }
        catch(error){
            console.log(error)
        }
    }
    async getCarts(){
        try{
            this.#carts = await this.leerArchivo()
            return this.#carts
        }
        catch(error){
            console.log(error)
        }
    }
    async updateCart(idCart,searchCart){
        try{
            this.#carts = await this.leerArchivo()
            const searchID = this.#carts.findIndex(cart=> {
                return cart.id ===Number(idCart)
            })
            this.#carts[searchID] = searchCart
            this.guardarArchivo()
        }
        catch(error){
            console.log(error)
        }
    }
    async leerArchivo(){
        try{
            let archivoJSON = await fs.promises.readFile(this.path,'utf-8')
            this.#carts = JSON.parse(archivoJSON)
            return this.#carts
        }
        catch{
            return []
        }
    }
    async guardarArchivo(){
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(this.#carts,null,'\t'),'utf-8')
        }
        catch(error){
            console.log(error)
        }
    }
}

module.exports = CartManager