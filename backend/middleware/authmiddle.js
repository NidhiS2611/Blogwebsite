const jwt = require('jsonwebtoken')
const authmiddle = async(req,res,next)=>{
    try{
const token = req.cookies.token
if(!token){
    return res.status(401).json({error:'unauthorized access'})
}
const decoded = jwt.verify(token ,process.env.JWT_SECRET)

req.user = decoded
console.log(req.user);



next()


    }

    catch(err){
        console.log(err);
        return res.status(500).json({error:'internal server error'})
        
    }
}

module.exports = authmiddle