const passport = require('passport')
const GitHubStrategy = require('passport-github2')
const UserManager = require('../dao/UserManagerDB.js')
const { createHash, isValidPassword } = require('../utils/bcrypt')

const userManager = new UserManager()

//Creamos la estrategia

const initializePassportGithub = () => {
    passport.use('github', new GitHubStrategy({
        clientID:'Iv23liTBgB80X0rXUIXa',
        clientSecret:'7334206239940dd7528220cb09371872761c42f3',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    },async(accessToken,refreshToken,profile,done)=>{
        try {
            console.log(profile)
            let user = await userManager.getUser({email:profile._json.email})
            if(!user){
                let newUser = {
                    first_name:profile._json.name,
                    last_name:'',
                    email:profile._json.email,
                    password:''
                }
                let result = await userManager.createUser(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
            
        } catch (error) {
            return done(error)
        }
    }))
    


    //Guarda el _id de la DB en session
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    //Extrae el usuario de session
    passport.deserializeUser(async(id,done)=>{
        try {
            let userFound = await userManager.getUser({_id:id})
            done(null,userFound)
        } catch (error) {
            done(error)
        }
    })
}

module.exports = {
    initializePassportGithub
}