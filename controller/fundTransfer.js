let level = require('../models/level')
let profile = require('../models/profile')


let mongoose = require('mongoose');
const wallet = require('../models/wallet');
const statement = require('../models/statement');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    fundsTransfer:function(req,res){
        let mobile = req.body.mobile
        let name = req.body.name 
        let amt = req.body.amt
        let toMobile = req.body.toMobile
        let toName = req.body.toName
        let t_id = 'S'+Date.now()
        

        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let walletBal = data.walletBal
                if(walletBal > amt){
                    let decAmt = parseFloat(walletBal - amt).toFixed(2)
                    wallet.updateOne({'mobile':mobile},{'walletBal':decAmt},(err)=>{
                        if(err){
                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                        }
                        else{
                            let from_ins = new statement({'mobile':mobile,'name':name, 'transId':t_id, 'status':'success', 'amt':amt, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':`Transferred to ${toName}`, 'tranType':'debit',
                            'remark':`Funds successfully transferred to ${toName}(${toMobile})`})

                            from_ins.save((err)=>{
                                if(err){
                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                }
                                else{
                                    let transId = "S"+Date.now()
                                    let to_ins = new statement({'mobile':toMobile,'name':toName, 'transId':transId, 'status':'success', 'amt':amt, 'date':Date.now(),
                                    'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':`Transfer from ${name}`, 'tranType':'credit',
                                    'remark':`Successful transfer from ${name}(${mobile})`})

                                    to_ins.save((err)=>{
                                        if(err){
                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                        }
                                        else{
                                            let famt = parseFloat(amt).toFixed(2)
                                            wallet.updateOne({'mobile':toMobile},{$inc:{'walletBal':famt}},(err)=>{
                                                if(err){
                                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                }
                                                else{
                                                    res.json({'err':0,'msg':'Transfer successfull.'})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else{
                    res.json({'err':2,'msg':'Low wallet balance please add funds.'})
                }
            }
        })
    }
}