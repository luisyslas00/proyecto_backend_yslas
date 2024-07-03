const fs = require('fs').promises;
const path = require('path');

const cartDataPath = path.join(__dirname, 'cart_data.json');

class CartDaoFile {
    async getCart(id) {
        try {
            const cartsData = await this.readCartData();
            const cart = cartsData.find(cart => cart._id === id);
            return cart || { status: 'failed', payload: "Carrito no encontrado" };
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return { status: 'failed', payload: "Carrito no encontrado" };
        }
    }

    async addCart(cart) {
        try {
            const cartsData = await this.readCartData();
            cartsData.push(cart);
            await this.writeCartData(cartsData);
            return cart;
        } catch (error) {
            console.error("Error al agregar el carrito:", error);
            return { status: 'failed', payload: "Error al agregar el carrito" };
        }
    }

    async addProduct(cid, pid) {
        try {
            const cartsData = await this.readCartData();
            const cart = cartsData.find(cart => cart._id === cid);
            
            let productExist = false;
            if (cart) {
                for (const cartProduct of cart.products) {
                    if (cartProduct.product._id.toString() === pid) {
                        cartProduct.quantity++;
                        productExist = true;
                        break;
                    }
                }
                if (!productExist) {
                    cart.products.push({ product: pid, quantity: 1 });
                }
            }

            await this.writeCartData(cartsData);
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            return { status: 'failed', payload: "Error al agregar el producto" };
        }
    }

    async deleteCart(id) {
        try {
            const cartsData = await this.readCartData();
            const updatedCartsData = cartsData.filter(cart => cart._id !== id);
            await this.writeCartData(updatedCartsData);
            return { status: 'success' };
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            return { status: 'failed', payload: "Error al eliminar el carrito" };
        }
    }

    async deleteProduct(cid, pid) {
        try {
            const cartsData = await this.readCartData();
            const cart = cartsData.find(cart => cart._id === cid);
            if (cart) {
                cart.products = cart.products.filter(cartProduct => cartProduct.product._id !== pid);
                await this.writeCartData(cartsData);
            }
            return { status: 'success' };
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return { status: 'failed', payload: "Error al eliminar el producto" };
        }
    }

    async updateCart(cid, newProducts) {
        try {
            const cartsData = await this.readCartData();
            const cart = cartsData.find(cart => cart._id === cid);
            if (cart) {
                cart.products = newProducts;
                await this.writeCartData(cartsData);
            }
            return { status: 'success' };
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return { status: 'failed', payload: "Error al actualizar el carrito" };
        }
    }

    async updateQuantity(cid, pid, newQuantity) {
        try {
            const cartsData = await this.readCartData();
            const cart = cartsData.find(cart => cart._id === cid);

            let productExist = false;
            if (cart) {
                for (const cartProduct of cart.products) {
                    if (cartProduct.product._id.toString() === pid) {
                        cartProduct.quantity += Number(newQuantity);
                        productExist = true;
                        break;
                    }
                }
                if (!productExist) {
                    cart.products.push({ product: pid, quantity: Number(newQuantity) });
                }
            }

            await this.writeCartData(cartsData);
            return { status: 'success' };
        } catch (error) {
            console.error("Error al actualizar la cantidad:", error);
            return { status: 'failed', payload: "Error al actualizar la cantidad" };
        }
    }

    async readCartData() {
        try {
            const data = await fs.readFile(cartDataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If file doesn't exist, return empty array
                return [];
            }
            throw error;
        }
    }

    async writeCartData(data) {
        await fs.writeFile(cartDataPath, JSON.stringify(data, null, 2));
    }
}

module.exports = CartDaoFile;

// const fs = require('fs')
// const path = './carts.json'

// class CartManager{
//     #carts
//     constructor(path){
//         this.#carts = []
//         this.path = path
//     }
//     async addCart(cart){
//         try{
//             this.#carts = await this.leerArchivo()
//             this.#carts.push(cart)
//             this.guardarArchivo()
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async getCarts(){
//         try{
//             this.#carts = await this.leerArchivo()
//             return this.#carts
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async updateCart(idCart,searchCart){
//         try{
//             this.#carts = await this.leerArchivo()
//             const searchID = this.#carts.findIndex(cart=> {
//                 return cart.id ===Number(idCart)
//             })
//             this.#carts[searchID] = searchCart
//             this.guardarArchivo()
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async leerArchivo(){
//         try{
//             let archivoJSON = await fs.promises.readFile(this.path,'utf-8')
//             this.#carts = JSON.parse(archivoJSON)
//             return this.#carts
//         }
//         catch{
//             return []
//         }
//     }
//     async guardarArchivo(){
//         try{
//             await fs.promises.writeFile(this.path,JSON.stringify(this.#carts,null,'\t'),'utf-8')
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
// }

// module.exports = CartManager
