let profile = require('../models/profile')
let login = require('../models/login')
let level = require('../models/level')
let statement = require('../models/statement')
let wallet = require('../models/wallet')
let admin = require('../models/admin')
let service = require('../models/service')
let circle_Code = require('../models/circleCode')
let ads = require('../models/ad')

let level_add = require('./level')
let emailFile = require('./email')

var otpGenerator = require('otp-generator')
let generator = require('generate-password');


let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    //Check Mobile 
    checkMob:function(req,res){
        let mobile = req.body.mobile
        
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length == 0){
                let otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
                res.json({'err':2,'msg':'Not registered yet', 'otp':otp});
            }
            else{
                login.findOne({'mobile':mobile},(err,data1)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        let pass = data1.password
                        res.json({'err':0, 'msg':'Data found login', 'password': pass});
                    }
                })
            }
        })
    },
    // Register
    register:function(req,res){
        let mobile = req.body.mobile
        let name = req.body.name
        let password = req.body.pass
        let sponsorNo = req.body.sponsorNo
        let email = req.body.email.toLowerCase()
        let id = generator.generate({
            length: 6,
            uppercase: false,
            numbers:true
        })
        
        profile.findOne({'id':id},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please Try again later!!!'})
            }
            else if(!data || data.length == 0 ){
                profile.findOne({'mobile':mobile},(err,data)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please Try again Later!!!'})
                    }
                    else if(!data || data.length == 0){
                        profile.findOne({'email':email},(err,data1)=>{
                            if(err){
                                res.json({'err':1,'msg':'Internal server error. Please Try again later!!!'})
                            }
                            else if(!data1 || data1.length == 0){
                                profile.findOne({'mobile':sponsorNo},(err,data2)=>{
                                    if(err){
                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                    }
                                    else{
                                        let S_name = data2.name
                                        let S_lvl = data2.lvlNo + 1
                                        let ancestors = data2.ancestors
                                        
                                        let ins = new profile({'id':id,'name':name, 'mobile':mobile, 'email': email, 'sponserName':S_name, 'sponser_Number':sponsorNo, 'ancestors':ancestors, 'lvlNo': S_lvl})
                                        ins.save((err)=>{
                                            if(err){
                                                res.json({'err':1,'msg':'Internal server error. Please Try again later!!!'})
                                                console.log(err)
                                            }
                                            else{
                                                let ins_l = new login({'id':id,'name':name, 'mobile':mobile, 'email':email, 'password':password})
                                                ins_l.save((err)=>{
                                                    if(err){
                                                        res.json({'err':1,'msg':'Internal server error. Please Try again later!!!'})
                                                    }
                                                    else{
                                                        let ins_w = new wallet({'name':name,'mobile':mobile,'walletBal':0,'lastBal':0,'currentBal':0,'totalearning':0,'utility':0,'eComm':0,
                                                        'demat':0,'ad':0,'reward':0,'lastReward':0});
                                                        ins_w.save((err)=>{
                                                            if(err){
                                                                res.json({'err':1,'msg':'Internal server error. Please Try again later!!!'})
                                                            }
                                                            else{
                                                                let ins_lvl = new level({'name':name,'mobile':mobile, 'lvlNo':S_lvl})
                                                                ins_lvl.save((err)=>{
                                                                    if(err){
                                                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                    }
                                                                    else{
                                                                        profile.updateOne({'mobile':mobile},{$addToSet:{'ancestors':[sponsorNo]}},(err)=>{
                                                                            if(err){
                                                                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                            }
                                                                            else{
                                                                                ins_ad = new ads({'name':name,'mobile':mobile,'adCount':{'adToday':0,'adMonth':0,'adTotal':0},'lastAd':Date.now()})
                                                                                ins_ad.save((err)=>{
                                                                                    if(err){
                                                                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                                    }
                                                                                    else{
                                                                                        level_add.addlevel(sponsorNo,res,mobile,name,email,id);
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
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                res.json({'err':2,'msg':'Email id already exists'})
                            }
                        })
                    }
                    else{
                        res.json({'err':2, 'msg':'Mobile No. Already exists'})
                    }
                })
            }
            else{
                res.json({'err':1,'msg':'Please try again later!!!'})
            }
        })
    },
    // addFirst
    addFirst:function(req,res){
        let mobile = req.body.mobile
        let name = req.body.name
        let email = req.body.email
        let pass = req.body.pass
        let id = generator.generate({
            length:6,
            uppercase:false,
            numbers:true
        })

        let ins = new profile({'id':id,'name':name,'mobile':mobile,'email':email,'ancestors':['admin'],'lvlNo':1,'sponserName':'admin','sponser_Number':1234567890})
        ins.save((err)=>{
            if(err) throw err
            else{
                let ins1 = new login({'id':id,'name':name,'mobile':mobile,'email':email,'password':1234})
                ins1.save((err)=>{
                    if(err) throw err
                    else{
                        let ins2 = new level({'name':name,'mobile':mobile,'lvlNo':1})
                        ins2.save((err)=>{
                            if(err) throw err
                            else{
                                let ins3 = new wallet({'name':name,'mobile':mobile,'walletBal':0,'lastBal':0,'currentBal':0,'totalearning':0,'utility':0,'eComm':0,
                                                        'demat':0,'ad':0,'reward':0,'lastReward':0})
                                ins3.save((err)=>{
                                    if(err) throw err
                                    else{
                                        let ins4 = new ads({'name':name,'mobile':mobile,'adCount':{'adToday':0,'adMonth':0,'adTotal':0},'lastAd':Date.now()})
                                        ins4.save((err)=>{
                                            if(err) throw err
                                            else{
                                                res.json({'err':0,'msg':'registered Succesfully'})
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
    // login
    login:function(req,res){
        let mobile = req.body.mobile
        let pass = req.body.pass

        login.findOne({'mobile':mobile,'password':pass},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length == 0){
                res.json({'err':2,'msg':'Invalid mobile or password. Please try again.'})
            }
            else{
                let name = data.name
                let id = data.id
                res.json({'err':0, 'msg':'Login sucessful',data:{'name':name,'mobile':mobile,'id':id}})
            }
        })
    },
    // Fetch sponsor
    fetchSponsor:function(req,res){
        let id = req.params.mob

        profile.findOne({'id':id},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length == 0){
                res.json({'err':2,'msg':'Sponser Not found. Please Try again!!!'})
            }
            else{
                let name = data.name
                let mobile = data.mobile
                res.json({'err':0,'msg':'success','data':{'name':name,'mobile':mobile}})
            }
        })
    },
    // fetch service
    fetchService:function(req,res){
        let type = req.params.type
        service.find({'service_Type':type},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                res.json({'err':0,'msg':'fetch sucessful.', 'data':data})
            }
        })
    },
    // fetch circle code
    fetchCircle:function(req,res){
        circle_Code.find({},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal Server error.'})
            }
            else{
                res.json({'err':0,'msg':'fetch successful', 'data': data})
            }
        })
    },
    // Fetch Team
    fetchTeam:function(req,res){
        let mobile = req.params.mob
        level.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error.'})
            }
            else if(!data || data.length == 0){
                res.json({'err':2, 'msg':'No data Found'})
            }
            else{
                res.json({'err':0, 'msg':'Data found successfully.','data':data})
            }
        })
    },
    // Fetch Balance
    fetchBal:function(req,res){
        let mobile = req.params.mob
        wallet.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error.'})
            }
            else if(!data || data.length == 0){
                res.json({'err':2, 'msg':'No data Found'})
            }
            else{
                res.json({'err':0, 'msg':'Data found successfully.','data':data})
            }
        })
    },
    // fetch Transaction
    fetchTran:function(req,res){
        let mobile = req.params.mob
        statement.find({'mobile':mobile},null,{sort:{'date':-1}},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error.'})
            }
            else if(!data || data.length == 0){
                res.json({'err':2, 'msg':'No data Found'})
            }
            else{
                res.json({'err':0, 'msg':'Data found successfully.','data':data})
            }
        })
    }
}
