module.exports.auth = async(req,res,next)=>{
    const token = req.headers.authorization??''
    if(!token) return res.sendStatus(401)
    if(token !== "Bearer faketoken_user1") return res.sendStatus(403)
    return next()
}