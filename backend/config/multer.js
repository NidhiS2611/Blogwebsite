const crypto = require('crypto')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination:function(req,res,cb){
cb(null,'public/uploads')
    },
filename:function(req,file,cb){
cb(null,crypto.randomBytes(20).toString('hex')+Date.now() +path.extname(file.originalname) )
}
})
 const upload = multer({
    storage:storage
 })

 module.exports = upload