function auth(req,res,next){
    if(req.session?.user?.email === "adminCoder@coder.com" && req.session?.user?.admin){
        return next()
    }
    return res.status(401).send('Error de autorización')
}

module.exports = {
    auth
}