module.exports.auth = async(req,res,next)=>{
    const token = req.headers.authorization??''
    if(!token) return res.json({status:400,message:'Token invalid!',data:[]})
    if(token !== "Bearer faketoken_user1") return res.json({status:400,message:'Incorrect Token!',data:[]})
    return next()
}