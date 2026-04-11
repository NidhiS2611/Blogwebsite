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
        type:String,
        default:'default.jpg'
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
    notificationSettings: {
      blog: {
        type: Boolean,
        default: false, // blog publish notification
      },
      follow: {
        type: Boolean,
        default: false,
      },
      like: {
        type: Boolean,
        default: false,
      },
      comment: {
        type: Boolean,
        default: false,
      },
    },
     fcmToken: {
      type: String,
      default: null,
    },
      created_at:{
        type:Date,
        default:Date.now
      },
      // ... tumhara baki schema
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blog' // Ye blog model ko point karega
        }
    ],




},
  
{ timestamps: true }
)
const usermodel = mongoose.model('user',userschema)
module.exports = usermodel