const mongoose = require('mongoose')


const blogschema = new mongoose.Schema({
title:String,
content:String,
excerpt:String,
author:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

media:{
    type:String,
    default:'default.jpg'
},
     

          
Comments:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }
],
likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
}],
category:{
    type:String,
    default:'Technology',   
    enum:['Technology','Study Tips','Career','Life Hacks','Research','Creative']
},



}, {timestamps:true}
)
const blogmodel = mongoose.model('blog',blogschema)
module.exports = blogmodel