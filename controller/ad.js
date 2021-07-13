let profile = require('../models/profile');
let ad = require('../models/ad');
let wallet = require('../models/wallet');
let statement =require('../models/statement');


let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    
    // Ad Transaction
    adTran:function(req,res){
       let mobile = req.body.mobile
       let amt = 1
       amt = (amt - (amt/2))/2
       let amtType =  'Reward'
       let name = req.body.name
       let adTime = req.body.time
       let tranId = "S" + Date.now()
       let status = 'success'

       

       profile.findOne({'mobile':mobile},(err,data)=>{
           if(err){
               res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
           }
           else{
               let s_No = data.sponser_Number
               let s_N = data.sponserName

               ad.findOne({'mobile':mobile},(err,data1)=>{
                   if(err){
                       res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                   }
                   else if(!data1 || data1.length == 0){
                        let ins = new ad({'mobile':mobile,'name':name, 'adCount':{'adToday':1,'adMonth':1,'adTotal':1}, 'lastAd': adTime})
                        ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                wallet.findOne({'mobile':mobile},(err,data)=>{
                                    if(err){
                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                    }
                                    else{
                                        // let T_ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':status, 'amt':amt, 
                                        //                         'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                        //                         'remark':'Your Ad watching cashback.'})
                                        // T_ins.save((err)=>{
                                        //     if(err){
                                        //         res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                        //     }
                                        //     else{
                                        //         this.adLvl1(s_N,s_No,name)
                                        //     }
                                        // })
                                    }
                                })
                            }
                        })
                   }
                   else{
                       ad.updateMany({'mobile':mobile},{'lastAd':adTime,$inc:{'adCount.adToday':1,'adCount.adMonth':1,'adCount.adTotal':1}},(err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                wallet.updateOne({"mobile":mobile},{"reward":1,"ad":1},(err)=>{
                                    if(err){
                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                    }
                                    else{
                                        let T_ins = new statement({'mobile':mobile,'name':name, 'transId':tranId, 'status':status, 'amt':amt, 
                                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                                'remark':'Your Ad watching cashback.'})
                                        T_ins.save((err)=>{
                                            if(err){
                                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                            }
                                            else{
                                                this.adLvl1(s_N,s_No,name,res)
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

    adLvl1:function(s_N,s_No,name,res){
        let mobile = s_No
        let nam = s_N
        let tranId = 'S'+ Date.now();
        let amt = 0.10
        let amtType = 'Reward'
        let status = 'success'
        let T_N = name
        let remark = 'Ad watching cashback from ' + T_N + ' (Tier 1)'

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let Sp_N = data.sponserName
                let Sp_No = data.sponser_Number
                
                wallet.updateMany({'mobile':mobile},{$inc:{'reward':amt,'ad':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':nam, 'transId':tranId, 'status':status, 'amt':amt, 
                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                'remark':remark})
                        T_ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.adLvl2(Sp_N,Sp_No,name,res)
                            }
                        })
                    }
                })
            }
        })

    },

    adLvl2:function(s_N,s_No,name,res){
        let mobile = s_No
        let nam = s_N
        let tranId = 'S'+ Date.now();
        let amt = 0.05
        let amtType = 'Reward'
        let status = 'success'
        let T_N = name
        let remark = 'Ad watching cashback from ' + T_N + ' (Tier 2)'

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let Sp_N = data.sponserName
                let Sp_No = data.sponser_Number
                
                wallet.updateMany({'mobile':mobile},{$inc:{'reward':amt,'ad':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':nam, 'transId':tranId, 'status':status, 'amt':amt, 
                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                'remark':remark})
                        T_ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.adLvl3(Sp_N,Sp_No,name,res)
                            }
                        })
                    }
                })
            }
        })

    },
    adLvl3:function(s_N,s_No,name,res){
        let mobile = s_No
        let nam = s_N
        let tranId = 'S'+ Date.now();
        let amt = 0.05
        let amtType = 'Reward'
        let status = 'success'
        let T_N = name
        let remark = 'Ad watching cashback from ' + T_N + ' (Tier 3)'

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let Sp_N = data.sponserName
                let Sp_No = data.sponser_Number
                
                wallet.updateMany({'mobile':mobile},{$inc:{'reward':amt,'ad':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':nam, 'transId':tranId, 'status':status, 'amt':amt, 
                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                'remark':remark})
                        T_ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.adLvl4(Sp_N,Sp_No,name,res)
                            }
                        })
                    }
                })
            }
        })

    },
    adLvl4:function(s_N,s_No,name,res){
        let mobile = s_No
        let nam = s_N
        let tranId = 'S'+ Date.now();
        let amt = 0.025
        let amtType = 'Reward'
        let status = 'success'
        let T_N = name
        let remark = 'Ad watching cashback from ' + T_N + ' (Tier 4)'

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let Sp_N = data.sponserName
                let Sp_No = data.sponser_Number
                
                wallet.updateMany({'mobile':mobile},{$inc:{'reward':amt,'ad':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':nam, 'transId':tranId, 'status':status, 'amt':amt, 
                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                'remark':remark})
                        T_ins.save((err)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                            }
                            else{
                                this.adLvl5(Sp_N,Sp_No,name,res)
                            }
                        })
                    }
                })
            }
        })

    },
    adLvl5:function(s_N,s_No,name,res){
        let mobile = s_No
        let nam = s_N
        let tranId = 'S'+ Date.now();
        let amt = 0.025
        let amtType = 'Reward'
        let status = 'success'
        let T_N = name
        let remark = 'Ad watching cashback from ' + T_N + ' (Tier 5)'

        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                let Sp_N = data.sponserName
                let Sp_No = data.sponser_Number
                
                wallet.updateMany({'mobile':mobile},{$inc:{'reward':amt,'ad':amt}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let T_ins = new statement({'mobile':mobile,'name':nam, 'transId':tranId, 'status':status, 'amt':amt, 
                                                'amtType': amtType, 'opreatorName':'Ads', 'transName':'Ad Cashback', 'tranType':'credit',
                                                'remark':remark})
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
    // fetch Ad Count

    fetchCount:function(req,res){
        let mobile= req.params.mob
            ad.findOne({'mobile':mobile},(err,data)=>{
                if(err){
                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                }
                else{
                    res.json({'err':0, 'msg': 'done', 'data':data})
                }
            })
    },

    // cron job
    cronJob:function(){
        ad.find({},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                
            }
        })
    },


}