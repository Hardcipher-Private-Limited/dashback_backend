let profile = require('../models/profile');
let wallet = require('../models/wallet');
let statement = require('../models/statement');
let level = require('../models/level');

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    // Become Premium

    premium:function(req,res){
        let mobile = req.params.mob
        let amtType= 'Balance'
        tranId = 'S'+Date.now()

        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let walletBal = data.walletBal
                let name = data.name
                let perm = 234.82
                let fBal = parseFloat(walletBal - perm).toFixed(2)
                if(walletBal >= perm){
                    wallet.updateOne({'mobile':mobile},{'walletBal':fBal},(err)=>{
                        if(err){
                            res.json({'err':1,'msg':'Internal server. Error please try again later!!!'})
                        }
                        else{
                            let ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':'Successful', 'amt':perm, 'date':Date.now(),
                            'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Premium Membership', 'tranType':'debit',
                            'remark':'Account updated to Premium Successfully.'})

                            ins.save((err)=>{
                                if(err){
                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                }
                                else{
                                    profile.updateOne({'mobile':mobile},{'account_Type':'Premium','activationDate':Date.now(),'premium_First':true},(err)=>{
                                        if(err){
                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                        }
                                        else{
                                            this.levelUpdate1(mobile,res);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else if(walletBal < perm){
                    res.json({'err':2,'msg':'Low wallet Balance. Please add funds'})
                }
            }
        })
    },

    levelUpdate1:function(mobile,res){
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl1.mobile':mobile},{'lvl1.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate2(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate2:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl2.mobile':mobile},{'lvl2.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate3(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate3:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl3.mobile':mobile},{'lvl3.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate4(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate4:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl4.mobile':mobile},{'lvl4.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate5(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate5:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl5.mobile':mobile},{'lvl5.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate6(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate6:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl6.mobile':mobile},{'lvl6.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate7(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate7:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl7.mobile':mobile},{'lvl7.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate8(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate8:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl8.mobile':mobile},{'lvl8.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate9(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate9:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl9.mobile':mobile},{'lvl9.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate10(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate10:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl10.mobile':mobile},{'lvl10.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate11(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate11:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl11.mobile':mobile},{'lvl11.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.levelUpdate12(mobile,spNo,res)
                    }
                })
            }
        })
    },
    levelUpdate12:function(mobile,spN,res){
        profile.findOne({'mobile':spN},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let spNo = data.sponser_Number
                level.updateOne({'mobile':spNo,'lvl12.mobile':mobile},{'lvl12.$.account':'Premium'},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        res.json({'err':0,'msg':'Premium Activated successfully'})
                    }
                })
            }
        })
    },
}