const jwt = require('jsonwebtoken')

// Ensure environment variables are loaded
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const generatetoken = async(newuser)=>{
   
    try{
        
        const token =  await jwt.sign({id:newuser._id, role:newuser.email}, process.env.JWT_SECRET, {expiresIn: '30m'})
          return token
    }
    catch(err){
        console.log(err)
        return {error: 'internal server error'}
    }
}

module.exports = {generatetoken}