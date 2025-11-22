const mongoose = require('mongoose');


const  userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   
    profilepicture:{
        type:Buffer
    },
    bio:{
        type:String,
        default:''
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    following:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    Blog:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'blog'
        }
    ],

    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ],
      created_at:{
        type:Date,
        default:Date.now
      }
      



},
  
{ timestamps: true }
)
const usermodel = mongoose.model('user',userschema)
module.exports = usermodel