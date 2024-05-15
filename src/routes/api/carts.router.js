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
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})

//Leer cada carrito
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
        const result = await cartManager.addProduct(cid,pid)
        if(result.status==="failed") return res.send(result)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/product/:pid',async(req,res)=>{
    try{
        const {cid,pid}=req.params
        const result = await cartManager.deleteProduct(cid,pid)
        if(result.status==="failed") return res.send(result)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})

//Modificar el carrito con un arreglo de productos
router.put('/:cid',async(req,res)=>{
    try{
        const { cid } = req.params;
        const newProducts = req.body;
        const result = await cartManager.updateCart(cid,newProducts)
        if(result.status==="failed") return res.send(result)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})

//Actualizar la cantidad del producto que se le pase por req.body
router.put('/:cid/product/:pid',async(req,res)=>{
    try{
        const { cid, pid } = req.params;
        const newQuantity = req.body.quantity;
        console.log(req.body)
        const result = await cartManager.updateQuantity(cid,pid,newQuantity)
        console.log(result)
        if(result.status==="failed") return res.send(result)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})
//Eliminar todos los productos del carrito
router.delete('/:cid',async(req,res)=>{
    const {cid} = req.params
    const result = await cartManager.deleteCart(cid)
    if(result.status==="failed") return res.send(result)
    res.send({status:"success",payload:result})
})

module.exports = router