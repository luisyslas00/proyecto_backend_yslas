const fs = require('fs')
const path = './database.json'

class ProductManager{
    #products
    constructor(path){
        this.#products = []
        this.path = path
    }
    async addProduct(objeto){
        try{
            this.#products = await this.leerArchivo()
            const product = {
                id:this.#agregarId(),
                title:objeto.title,
                description:objeto.description,
                price:objeto.price,
                thumbnail:objeto.thumbnail,
                status:true,
                code:objeto.code,
                stock:objeto.stock
            }
            const {title,description,price,thumbnail,code,stock} = product
            if(title===""||description===""||price===0||thumbnail===""||code===""||stock===0){
                return {status:'failed', payload:"Rellenar correctamente los campos"}
            }
            let repite = this.#products.some(elemento=>{
                return elemento.code === code
            })
            if(repite){
                return {status:'failed', payload: "Código repetido"}
            }else{
                this.#products.push(product)
                this.writeFile()
                return product
            }
        }
        catch(error){
            console.log(error)
        }
    }
    async getProducts(){
        try{
            this.#products = await this.leerArchivo()
            return this.#products
        }
        catch(error){
            console.log(error)
        }
    }
    async getProductById(identificador){
        try{
            this.#products = await this.leerArchivo()
            let buscar= this.#products.find(elemento =>{
                return elemento.id === identificador
            })
            if(buscar){
                console.log(buscar)
            }else{
                console.log("Not Found")
            }
        }
        catch(error){
            console.log(error)
        }
    }
    async updateProduct(id,objeto){
        try{
            this.#products = await this.leerArchivo()
            let existeProducto = this.#products.find(producto=>{
                return producto.id === id
            })
            if(existeProducto){
                let buscarProducto = this.#products.findIndex(elemento=> elemento.id === existeProducto.id)
                this.#products[buscarProducto] = {...this.#products[buscarProducto], ...objeto}
                this.writeFile()
                return this.#products[buscarProducto]
            }else{
                return {status:'failed', payload:'No existe producto con ese id'}
            }
        }
        catch(error){
            console.log(error)
        }
    }
    async deleteProduct(identificador){
        try{
            this.#products = await this.leerArchivo()
            let indexProduct = this.#products.findIndex(elemento=>{
                return elemento.id === identificador
            })
            if(indexProduct!==-1){
                this.#products.splice(indexProduct,1)
                this.writeFile()
            }
        }
        catch(error){
            console.log(error)
        }
    }
    async writeFile(){
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(this.#products,null,'\t'),'utf-8')
            console.log("Archivo guardado")
        }
        catch(error){
            console.log("Error")
        }
    }
    async leerArchivo(){
        try{
            let archivoJSON = await fs.promises.readFile(this.path,'utf-8')
            this.#products = JSON.parse(archivoJSON)
            return this.#products
        }
        catch(error){
            return []
        }
    }
    #agregarId(){
        if(this.#products.length ===0){
            return 1
        }
        return this.#products.at(-1).id + 1
    }
}

const product = new ProductManager(path)

module.exports = ProductManager