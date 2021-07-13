let mongoose = require('mongoose');

module.exports = mongoose.model('circle',{
    circle_Name:{
        type: String
    },
    circle_Code:{
        type: Number
    }
})