
let wallet = require('../models/wallet');
let statement = require('../models/statement');
let profile = require('../models/profile');

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
                profile.findOne({'mobile':mobile},(err,data)=>{
                    if(err){
                        res.json({'err':1,'msg':'Interal server error. Please try again later!!!'})
                    }
                    if(data.premium_First == false || data.premium_First == null){
                        let last = data.walletBal
                        wallet.updateOne({'mobile':mobile},{'lastBal':last,$inc:{'walletBal':amt,'currentBal':amt}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'err'})
                            }
                            else{
                                let T_ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':status, 'amt':amt, 'date':Date.now(),
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
                    if(data.premium_First == true){
                        let last = data.walletBal
                        wallet.updateOne({'mobile':mobile},{'lastBal':last,$inc:{'walletBal':amt,'currentBal':amt}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'err'})
                            }
                            else{
                                let T_ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':status, 'amt':amt, 'date':Date.now(),
                                                                        'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Funds Added', 'tranType':'credit',
                                                                        'remark':'Funds succesfully added to wallet'})

                                T_ins.save((err)=>{
                                    if(err){
                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                    }
                                    else{
                                        profile.updateOne({'mobile':mobile},{'premium_First':false},(err)=>{
                                            if(err){
                                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                            }
                                            else{
                                                let t_id = 'S'+Date.now()
                                                if(amt > 100){
                                                    let c_ins = new statement({'mobile':mobile,'name':name, 'transId':t_id, 'status':status, 'amt':100, 'date':Date.now(),
                                                    'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'First Wallet Recharge Cashback', 'tranType':'credit',
                                                    'remark':'First wallet recharge Cashback'})
                                                    c_ins.save((err)=>{
                                                        if(err){
                                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                        }
                                                        else{
                                                            wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':100}},(err)=>{
                                                                if(err){
                                                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                }
                                                                else{
                                                                    let cash = 100
                                                                    this.wallLvl1(mobile,cash,res)
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                                else{
                                                    let c_ins = new statement({'mobile':mobile,'name':name, 'transId':t_id, 'status':status, 'amt':amt, 'date':Date.now(),
                                                    'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'First Wallet Recharge Cashback', 'tranType':'credit',
                                                    'remark':'First wallet recharge Cashback'})

                                                    c_ins.save((err)=>{
                                                        if(err){
                                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                        }
                                                        else{
                                                            wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':amt}},(err)=>{
                                                                if(err){
                                                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                }
                                                                else{
                                                                    this.wallLvl1(mobile,amt,res)
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    // first wallet recharge level cashback code begins 
    wallLvl1:function(mobile,amt,res){
        let t_id = 'S'+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number;
                let name = data.sponserName;
                let cash = parseFloat(amt * 0.2).toFixed(2);
                let c_ins = new statement({'mobile':spNo,'name':name, 'transId':t_id, 'status':status, 'amt':cash, 'date':Date.now(),
                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                'remark':'First wallet recharge referral Cashback Tier 1'})

                c_ins.save((err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        wallet.updateOne({'mobile':spNo},{$inc:{'walletBal':cash}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.wallLvl2(mobile,amt,spNo,res);
                            }
                        })
                    }
                })
            }
        })
    },

    wallLvl2:function(mobile,amt,spNo,res){
        let t_id = 'S'+Date.now()
        profile.findOne({'mobile':spNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spN = data.sponser_Number;
                let name = data.sponserName;
                let cash = parseFloat(amt * 0.1).toFixed(2);
                let c_ins = new statement({'mobile':spN,'name':name, 'transId':t_id, 'status':status, 'amt':cash, 'date':Date.now(),
                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                'remark':'First wallet recharge referral Cashback Tier 2'})

                c_ins.save((err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        wallet.updateOne({'mobile':spN},{$inc:{'walletBal':cash}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.wallLvl3(mobile,amt,spN,res);
                            }
                        })
                    }
                })
            }
        })
    },

    wallLvl3:function(mobile,amt,spNo,res){
        let t_id = 'S'+Date.now()
        profile.findOne({'mobile':spNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spN = data.sponser_Number;
                let name = data.sponserName;
                let cash = parseFloat(amt * 0.1).toFixed(2);
                let c_ins = new statement({'mobile':spN,'name':name, 'transId':t_id, 'status':status, 'amt':cash, 'date':Date.now(),
                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                'remark':'First wallet recharge referral Cashback Tier 3'})

                c_ins.save((err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        wallet.updateOne({'mobile':spN},{$inc:{'walletBal':cash}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.wallLvl4(mobile,amt,spN,res);
                            }
                        })
                    }
                })
            }
        })
    },

    wallLvl4:function(mobile,amt,spNo,res){
        let t_id = 'S'+Date.now()
        profile.findOne({'mobile':spNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spN = data.sponser_Number;
                let name = data.sponserName;
                let cash = parseFloat(amt * 0.05).toFixed(2);
                let c_ins = new statement({'mobile':spN,'name':name, 'transId':t_id, 'status':status, 'amt':cash, 'date':Date.now(),
                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                'remark':'First wallet recharge referral Cashback Tier 4'})

                c_ins.save((err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        wallet.updateOne({'mobile':spN},{$inc:{'walletBal':cash}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.wallLvl5(mobile,amt,spN,res);
                            }
                        })
                    }
                })
            }
        })
    },

    wallLvl5:function(mobile,amt,spNo,res){
        let t_id = 'S'+Date.now()
        profile.findOne({'mobile':spNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spN = data.sponser_Number;
                let name = data.sponserName;
                let cash = parseFloat(amt * 0.05).toFixed(2);
                let c_ins = new statement({'mobile':spN,'name':name, 'transId':t_id, 'status':status, 'amt':cash, 'date':Date.now(),
                'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                'remark':'First wallet recharge referral Cashback Tier 5'})

                c_ins.save((err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        wallet.updateOne({'mobile':spN},{$inc:{'walletBal':cash}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                res.json({'err':0,'msg':'done'})
                                this.add5Id()
                            }
                        })
                    }
                })
            }
        })
    },
    add5Id:function(amt){
        let Numbers = [9711855888,7532866802,9354951735,9999509088,9555047692]
        wallet.updateMany({'mobile':Numbers},{$inc:{'walletBal':4}},(err)=>{
            if(err){
                console.log(err)

            }
            else{
                console.log('done')
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