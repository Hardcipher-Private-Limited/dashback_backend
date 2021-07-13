let mongoose = require('mongoose');

module.exports = mongoose.model('profile',{
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
    sponserName:{
        type:String
    },
    sponser_Number:{
        type:Number
    },
    lvlNo:{
        type:Number,
    },
    regi_Date:{
        type:Date,
        'default':Date.now()
    },
    account_Type:{
        type:String
    },
    activationDate:{
        type:String
    },
    ancestors:[],
    account_Details:[
        {
            accountNo:{
                type:Number
            },
            ifsc:{
                type:String
            },
            name:{
                type:String
            }
        }
    ]
})