let mongoose = require('mongoose');

module.exports = mongoose.model('login',{
    id:{
        unique:true,
        length:6,
        type:String,
        required:true
    },
    name:{
        type:String
    },
    mobile:{
        type:Number
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})