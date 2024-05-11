const { Router } = require('express')
const ProductManager = require('../../dao/ProductManagerDB.js')

const productManager = new ProductManager()
const router = Router()

//Configuración

//Se muestran los productos en la ruta '/api/products'
router.get('/',async (req,res)=>{
    try{
        const {newPage,limit,ord} = req.query
        const {docs, totalPages,page,hasPrevPage,hasNextPage,prevPage,nextPage} = await productManager.getProducts({newPage,limit,ord})
        res.send({status:"success",payload:docs,totalPages,prevPage,nextPage,page,hasPrevPage,hasNextPage})
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
        if(product.status==="failed") return res.send(product)
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
        if(result.status === 'failed') return res.send(result)
        res.send({status:'success',payload:result})
    }
    catch(error){
        console.log(error)
    }
})

module.exports = router