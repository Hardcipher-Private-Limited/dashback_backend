let mongoose = require('mongoose');

module.exports = mongoose.model('service',{
    operator_Name:{
        type:String
    },
    service_Type:{
        type:String
    },
    operator_Code:{
        type:String
    },
    min_Amount_Range:{
        type:Number
    },
    max_Amount_Range:{
        type:Number
    },
    partial_Pay:{
        type:Boolean
    },
    "HSN/SAC":{
        type: Number
    },
    bill_Fetch:{
        type:Boolean
    },
    digits:{
        type:Number
    },
    account_Display:{
        type:String
    },
    account_Type:{
        type: String
    },
    commission:{
        type: Number
    },
    Percentage_Flat:{
        type: String
    }
})
