
let wallet = require('../models/wallet');
let statement = require('../models/statement');

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    addWalletAmt:function(req,res){
        let amt = req.body.amt
        let mobile = req.body.mobile
        let name = req.body.name
        let tranId = "S" + Date.now()
        let status = "success"
        let amtType = "Balance"

        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1, 'msg': 'Internal server Error. Please try again later!!!'})
            }
            else{
                let last = data.walletBal
                wallet.updateOne({'mobile':mobile},{'lastBal':last,$inc:{'walletBal':amt,'currentBal':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'err'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':status, 'amt':amt, 
                                                                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Funds Added', 'tranType':'credit',
                                                                'remark':'Funds succesfully added to wallet'})

                        T_ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                res.json({'err':0,'msg':'done'})
                            }
                        })
                    }
                })
            }
        })
    },

    // fetch Balance
    fetchBal:function(req,res){
        let mobile = req.params.mob

        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                res.json({'err':0, 'msg':'Done', 'data':data})
            }
        })
    }
}