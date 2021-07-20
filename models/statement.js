let mongoose = require('mongoose');

module.exports = mongoose.model('statement',{
    mobile:{
        type:Number
    },
    name:{
        type:String
    },
    date:{
        type:Date,
    },
    remark:{
        type: String
    },

    tranType:{
        type: String
    },
    amt:{
        type: Number
    },
    amtType:{
        type:String
    },
    lastBal:{
        type: Number
    },
    lastBalType:{
        type: String
    },
    transId:{
        type:String
    },
    referenceId:{
        type:String
    },
    referenceType:{
        type:String
    },
    transName:{
        type:String
    },
    opreatorName:{
        type:String
    },
    operatorCode:{
        type:String
    },
    transNo:{
        type:String
    },
    status:{
        type:String
    },
    tranRes:{}
})