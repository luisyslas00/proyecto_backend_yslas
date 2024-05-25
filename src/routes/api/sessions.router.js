const { Router } = require('express')
const { auth } = require('../../middleware/auth.middleware')
const UserManager = require('../../dao/UserManagerDB')

const router = Router()
const userManager = new UserManager()
//Login
router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    //Completar todos los datos
    if(!email||!password) return res.send({status:"Error",error:"Completar todos los datos"})
    const userFound = await userManager.getUser({email})
    if(!userFound) return res.send({status:"Error",error:"Usuario no registrado"})
    if(password === userFound.password){
        req.session.user = {
            email,
            admin: userFound.role === "admin"
        }
        return res.send({status:"success",message:"Login success!"})
    }else{
        return res.send({status:"Error",error:"Contraseña incorrecta"})
    }
})

//Register
router.post('/register',async(req,res)=>{
    try{
        const {first_name,last_name,email,password} =req.body
        //Completar todos los datos
        if(!first_name ||!last_name||!email||!password) return res.send({status:"Error",error:"Completar todos los datos"})
        //Verifico si existe el usuario, no puedo crear uno ya existente con el mismo email
        const userFound = await userManager.getUser({email})
        if(userFound) return res.send({status:"Error",error:"Ya existe el usuario"})
        const newUser = {
            first_name,
            last_name,
            email,
            password
        }
        const user = await userManager.createUser(newUser)
        res.send({status:"success",message:"Usuario registrado correctamente"})
    }catch(error){
        console.log(error)
    }
})

//Logout
router.get('/logout',(req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            return res.send({status:"failed",error:error})
        }else{
            return res.redirect('/login')
        }
    })
})

//Current
router.get('/current',auth,(req,res)=>{
    res.send("Ruta protegida")
})

module.exports = router