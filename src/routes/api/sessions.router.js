const { Router } = require('express')
const { auth } = require('../../middleware/auth.middleware')
const UserManager = require('../../dao/UserManagerDB')
const { createHash, isValidPassword } = require('../../utils/bcrypt')
const passport = require('passport')

const router = Router()
const userManager = new UserManager()

//Register - Passport
router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}),async(req,res)=>{
    res.send({status:'success',message:'Usuario registrado'})
})

//Fail register - Passport
router.get('/failregister',async(req,res)=>{
    console.log('Falló el registro')
    res.send({status:'error',error:'Failed'})
})

//Login - Passport
router.post('/login',passport.authenticate('login',{failureRedirect:'/faillogin'}),async(req,res)=>{
    if(!req.user) return res.send({status:'error',error:'Credenciales inválidas'})
    req.session.user = {
        first_name: req.user.first_name,
        email: req.user.email
    }
    console.log(req.session.user)
    res.send({status:'success',payload:req.user})
})

//Fail login - Passport
router.get('/faillogin',async(req,res)=>{
    console.log('Falló el login')
    res.send({error:'Failed'})
})

//Github

router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user
    res.redirect('/products')
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

//Código anterior 

//Login
// router.post('/login',async(req,res)=>{
//     const {email,password} = req.body
//     //Completar todos los datos
//     if(!email||!password) return res.send({status:"Error",error:"Completar todos los datos"})
//     const userFound = await userManager.getUser({email})
//     if(!userFound) return res.send({status:"Error",error:"Usuario no registrado"})

//     const isValid = isValidPassword(password,{password:userFound.password})

//     if(!isValid) return res.send({status:"Error",error:"Contraseña incorrecta"})
//     req.session.user = {
//         email,
//         first_name:userFound["first_name"],
//         last_name:userFound["last_name"],
//         admin: userFound.role === "admin"
//     }
//     return res.send({status:"success",message:"Login success!"})
// })

// //Register
// router.post('/register',async(req,res)=>{
//     try{
//         const {first_name,last_name,email,password} =req.body
//         //Completar todos los datos
//         if(!first_name ||!last_name||!email||!password) return res.send({status:"Error",error:"Completar todos los datos"})
//         //Verifico si existe el usuario, no puedo crear uno ya existente con el mismo email
//         const userFound = await userManager.getUser({email})
//         if(userFound) return res.send({status:"Error",error:"Ya existe el usuario"})
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             password: createHash(password)
//         }
//         const user = await userManager.createUser(newUser)
//         res.send({status:"success",message:"Usuario registrado correctamente"})
//     }catch(error){
//         console.log(error)
//     }
// })