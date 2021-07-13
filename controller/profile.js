let profile = require('../models/profile');
let wallet = require('../models/wallet');

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    // fetch profile

    fetchProfile:function(req,res){
        let mobile = req.params.mob

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                console.log(err)
            }
            else{
                res.json({'err':0,'msg':'Done','data':data});
            }
        })
    }
}