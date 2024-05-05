const { Router } = require('express')
const ProductManager = require('../../dao/ProductManagerDB.js')

const productManager = new ProductManager()
const router = Router()

//Configuración

//Se muestran los productos en la ruta '/api/products', además se trabaja con query ?limit
router.get('/',async (req,res)=>{
    try{
        const products = productManager.getProducts()
        const productsDB = await products
        const {limit} = req.query
        if(limit<productsDB.length){
            const productsFilter = productsDB.slice(0,Number(limit))
            return res.send(productsFilter)
        }
        res.send(productsDB)
    }
    catch(error){
        console.log(error)
    }
}
)
// //Ver producto por ID
router.get('/:pid',async(req,res)=>{
    try{
        const {pid} = req.params
        const product = await productManager.getProductById(pid)
        //Queda validar si no lo encuentra
        res.send({status:'success',payload:product})
    }
    catch(error){
        console.log(error)
    }
})
//Agregar producto
router.post('/',async (req,res)=>{
    try{
        const result = await productManager.addProduct(req.body)
        if(result.status === 'failed')return res.send(result)
        res.send({status:"success",payload:result})
    }
    catch(error){
        console.log(error)
    }
})
// //Modificar producto
router.put('/:pid',async(req,res)=>{
    try{
        const {pid} = req.params
        const productUpdate = req.body
        const result = await productManager.updateProduct(pid,productUpdate)
        if(result.status === 'failed') return res.send(result)
        res.send({status:'success',payload:result})
    }
    catch(error){
        console.log(error)
    }
})
// //Eliminar producto
router.delete('/:pid',async(req,res)=>{
    try{
        const {pid} = req.params
        const result = await productManager.deleteProduct(pid)
        res.send({status:'success',payload:result})
    }
    catch(error){
        console.log(error)
    }
})

module.exports = router