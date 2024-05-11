const { Router } = require('express')
const CartManager = require('../../dao/CartManagerDB.js')

const router = Router()
const cartManager = new CartManager()

//Creando cart
router.post('/',async(req,res)=>{
    try{
        const cart = {
            "products":[]
        }
        const result = await cartManager.addCart(cart)
        res.send({status:"success",payload:cart})
    }
    catch(error){
        console.log(error)
    }
})

// //Leer cada carrito
router.get('/:cid',async (req,res)=>{
    try{
        const {cid} = req.params
        const cart = await cartManager.getCart(cid)
        if(cart.status==="failed") return res.send(cart)
        res.send({status:"success",payload:cart})
    }
    catch(error){
        console.log(error)
    }
})

//Agregar productos, indicando id cart y id product

router.post('/:cid/product/:pid',async(req,res)=>{
    try{
        const {cid,pid} = req.params
        //Verificar si el producto existe, sumarle quantity
        const result = await cartManager.addProduct(cid,pid)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})

// router.post('/:cid/product/:pid',async(req,res)=>{
//     try{
//         const {cid,pid} = req.params
//         //Presenta un error, es el que más me costó
//         await cartManager.updateCart(cid,pid)
//         res.send({status:"success",payload:"Producto agregado"})
//     }
//     catch(error){
//         console.log(error)
//     }
// })

// router.post('/:cid/product/:pid',async(req,res)=>{
//     try{
//         const {cid,pid} = req.params
//         const myProducts = {
//             id:Number(pid),
//             quantity:1
//         }
//         const cartsDB = await cartManager.getCarts()
//         const searchCart = cartsDB.find(el=>el.id===Number(cid))
//         if(!searchCart) return res.status(404).send({status:"error",error:"Carrito no encontrado"})
//         const {products} = searchCart
//         const searchProduct = products.find(el=>el.id===Number(pid))
//         if(searchProduct){
//             searchProduct.quantity +=1
//         }else{
//             products.push(myProducts)
//         }
//         cartManager.updateCart(cid,searchCart)
//         res.send({status:"success",payload:products})
//     }
//     catch(error){
//         console.log(error)
//     }
// })

// //Eliminar producto
// router.delete('/:cid',async(req,res)=>{
//     try{
//         const {cid} = req.params
//         const result = await cartManager.deleteProduct(cid)
//         res.send({status:'success',payload:result})
//     }
//     catch(error){
//         console.log(error)
//     }
// })

module.exports = router