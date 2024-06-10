const { Router } = require('express')
const { auth } = require('../../middleware/auth.middleware')
const UserManager = require('../../dao/UserManagerDB')
const { createHash, isValidPassword } = require('../../utils/bcrypt')
const passport = require('passport')
const { generateToken } = require('../../utils/jwt')
const { passportCall } = require('../../middleware/passportCall.middleware')
const CartManager = require('../../dao/CartManagerDB')

const router = Router()
const userManager = new UserManager()
const cartManager = new CartManager()

//Register
router.post('/register',async(req,res)=>{
    const { first_name,last_name,age,email,password } = req.body
    if(!password || !email) return res.send({status:'failed',message:'Completar los datos'})
    const userFound = await userManager.getUser({email})
    if(userFound) return res.send({status:'failed',message:'Usuario existente'})
    const newCart = {
        "products":[]
    }
    const cart = await cartManager.addCart(newCart)
    const newUser = {
        first_name,
        last_name,
        age,
        email,
        cartID:cart._id,
        password: createHash(password)
    }
    const result = await userManager.createUser(newUser)
    const token = generateToken({
        email,
        id:result._id,
        first_name,
        last_name,
    })
    res.cookie('token',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
    }).send({status:'success',message:'Usuario registrado'})
})

//Login
router.post('/login',async(req,res)=>{
    const {email,password} =req.body
    if(!password || !email) return res.send({status:'failed',message:'Completar los datos'})
    const userFound = await userManager.getUser({email})
    if(!isValidPassword({password:userFound.password},password)) return res.send({status:'failed',message:'Datos incorrectos'})
    const token = generateToken({
        id:userFound._id,
        email,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        role:userFound.role
    })
    res.cookie('token',token,{
        maxAge:60*60*1000*24,
        httpOnly:true
    })
    .send({status:'success',message:'Usuario logueado'})
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
router.get('/current',passportCall('jwt'),auth('admin'),(req,res)=>{
    res.send("Ruta protegida")
})

module.exports = router

// //Register - Passport
// router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}),async(req,res)=>{
//     res.send({status:'success',message:'Usuario registrado'})
// })

// //Fail register - Passport
// router.get('/failregister',async(req,res)=>{
//     console.log('Falló el registro')
//     res.send({status:'error',error:'Failed'})
// })

// //Login - Passport
// router.post('/login',passport.authenticate('login',{failureRedirect:'/faillogin'}),async(req,res)=>{
//     if(!req.user) return res.send({status:'error',error:'Credenciales inválidas'})
//     req.session.user = {
//         first_name: req.user.first_name,
//         email: req.user.email
//     }
//     console.log(req.session.user)
//     res.send({status:'success',payload:req.user})
// })

// //Fail login - Passport
// router.get('/faillogin',async(req,res)=>{
//     console.log('Falló el login')
//     res.send({error:'Failed'})
// })