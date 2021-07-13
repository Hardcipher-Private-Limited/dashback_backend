let mongoose = require('mongoose');

module.exports= mongoose.model('ad',{
    name:{
        type:String
    },
    mobile:{
        type:Number
    },
    adCount:{
        adToday:{
            type:Number
        },
        adMonth:{
            type:Number
        },
        adTotal:{
            type:Number
        }
    },
    lastAd:{
        type:Date
    }
})