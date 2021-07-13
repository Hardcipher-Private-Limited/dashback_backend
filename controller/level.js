let level = require('../models/level')
let profile = require('../models/profile')

let emailFile = require('./email')

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={

    // add level 1 
    addlevel:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl1:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel2(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 2
    addlevel2:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl2:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel3(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    
    // add level 3
    addlevel3:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl3:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel4(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 4
    addlevel4:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl4:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel5(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 5
    addlevel5:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl5:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel6(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 6
    addlevel6:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl6:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel7(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 7
    addlevel7:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl7:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel8(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 8
    addlevel8:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl8:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel9(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 9
    addlevel9:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl9:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel10(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 10
    addlevel10:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl10:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel11(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 11
    addlevel11:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl11:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        this.addlevel12(sponser,res,mobile,name,email,id)
                    }
                })
            }
        })
    },
    // add level 12
    addlevel12:function(sponsorNo,res,mobile,name,email,id){
        profile.findOne({'mobile':sponsorNo},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else if(!data || data.length==0){
                emailFile.regiEmail(res,mobile,name,email,id);
            }
            else{
                let sponser = data.sponser_Number
                level.updateOne({'mobile':sponsorNo},{$addToSet:{lvl12:[{'name':name,'mobile':mobile,'earning':{'utility':0,'utilityToday':0,'utilityMonth':0,'eComm':0,'eCommToday':0,'eCommMonth':0,'demat':0,'ad':0,'adToday':0,'adMonth':0}}]}},(err)=>{
                    if(err){
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    }
                    else{
                        emailFile.regiEmail(res,mobile,name,email,id)
                    }
                })
            }
        })
    }
}