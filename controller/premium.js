let profile = require('../models/profile');
let wallet = require('../models/wallet');

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    // Become Premium

    premium:function(req,res){
        let mobile = req.params.mob

        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let walletBal = data.walletBal
                let perm = 234.82
                if(walletBal >= perm){
                    res.json({'err':0,'msg':'Done'})
                }
                else if(walletBal < perm){
                    res.json({'err':2,'msg':'Low wallet Balance. Please add funds'})
                }
            }
        })
    }
}