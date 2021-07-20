let wallet = require('../models/wallet');
let statement = require('../models/statement');
let service = require('../models/service');
let profile = require('../models/profile');
let level = require('../models/level');

let memberId = "AP285499"
let APIkey = "829CDBDB02"

const https = require('https')

let mongoose = require('mongoose');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    recharge(req,res){
        let name = req.body.accName
        let Mobile = req.body.accNo
        let tranNo = req.body.number
        let amt = req.body.amt
        let circleCode = req.body.circleCode
        let circle = req.body.circle
        let operator = req.body.operator
        let operatorCode = req.body.operatorCode
        let amtType = 'Balance'
        let Otype = req.body.type

        let transId = "S"+Date.now()


        wallet.findOne({'mobile':Mobile},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal Server error. Please try again later!!!'})
            }
            else{
                let walBal = data.walletBal
                console.log(walBal)
                if(walBal > amt){
                    https.get(`https://cyrusrecharge.in/api/balance.aspx?memberid=${memberId}&pin=${APIkey}&format=json`, (resp)=>{
                        let data_Bal = "";

                        resp.on('data',(chunck)=>{
                            data_Bal += chunck
                        })

                        resp.on('end',()=>{
                            let bal = JSON.parse(data_Bal).Balance
                            if(bal < walBal){
                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                console.log(bal)
                            }
                            else{
                                console.log(bal)
                                service.findOne({'operator_Name':operator,'operator_Code':operatorCode},(err,data2)=>{
                                    if(err){
                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                    }
                                    else{
                                        // console.log(JSON.parse(data2))
                                        let commision = data2.commission
                                        let commison_Type = data2.Percentage_Flat
                                        console.log(Otype)
                                        if (Otype == "Postpaid-Mobile" || Otype == "Prepaid-Mobile" ) {
                                            https.get(`https://cyrusrecharge.in/api/recharge.aspx?memberid=${memberId}&pin=${APIkey}&number=${tranNo}
                                                    &operator=${operatorCode}&circle=${circleCode}&amount=${amt}&usertx=${transId}&format=json`,
                                                (resp) => {
                                                    let Tran_data = "";

                                                    resp.on('data', (chunck) => {
                                                        Tran_data += chunck
                                                    })

                                                    resp.on('end', () => {
                                                        console.log(Tran_data);
                                                        let trans_res = JSON.parse(Tran_data);
                                                        wallet.updateOne({ 'mobile': Mobile }, { $inc: { 'walletBal': -amt } }, (err) => {
                                                            if (err) {
                                                                res.json({ 'err': 1, 'msg': 'Internal server error. Please try again later!!!' })
                                                            }
                                                            else {
                                                                let ins = new statement({
                                                                    'mobile': Mobile, 'name': name, 'transId': transId, 'status': 'Pending', 'amt': amt, 'date': Date.now(),
                                                                    'amtType': amtType, 'opreatorName': operator, 'operatorCode': operatorCode, 'transName': 'Recharge/Bill Payment', 'tranType': 'Debit',
                                                                    'remark': `Recharge/Bill payment transaction accepted.`
                                                                })
                                                                ins.save((err) => {
                                                                    if (err) {
                                                                        res.json({ 'err': 1, 'msg': 'Internal server error. Please try again later!!!!' })
                                                                    }
                                                                    else {
                                                                        if (trans_res.Status == "Failure" || trans_res.Status == "FAILURE") {
                                                                            let new_transID = "S" + Date.now()
                                                                            statement.updateOne({ 'mobile': Mobile, 'transId': transId }, {
                                                                                'status': 'Failure', 'remark': 'Recharge/Bill payment transaction failed.',
                                                                                'tranRes': trans_res
                                                                            }, (err) => {
                                                                                if (err) {
                                                                                    res.json({ 'err': 1, 'msg': 'Internal server error. Please try again later!!!' })
                                                                                }
                                                                                else {
                                                                                    wallet.updateOne({ 'mobile': Mobile }, { $inc: { 'walletBal': amt } }, (err) => {
                                                                                        if (err) {
                                                                                            res.json({ 'err': 1, 'msg': 'Internal server error. Please try again later!!!' })
                                                                                        }
                                                                                        else {
                                                                                            let ins_sat = new statement({
                                                                                                'mobile': Mobile, 'name': name, 'transId': new_transID, 'status': 'Succesful', 'amt': amt, 'date': Date.now(),
                                                                                                'amtType': amtType, 'opreatorName': 'Wallet funds', 'transName': 'Refunded', 'tranType': 'credit',
                                                                                                'remark': 'Funds succesfully refunded to wallet'
                                                                                            })

                                                                                            ins_sat.save((err) => {
                                                                                                if (err) {
                                                                                                    res.json({ 'err': 1, 'msg': 'Internal server error. Please try again later!!!' })
                                                                                                }
                                                                                                else {
                                                                                                    res.json({ 'err': 3, 'msg': trans_res.ErrorMessage })
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                        if (trans_res.Status == "Success") {
                                                                            this.success(transId, Mobile, name, trans_res, amt, commision, commison_Type)
                                                                        }
                                                                        if (trans_res.Status == "Pending") {
                                                                            res.json({ 'err': 0, 'msg': 'Transaction initiated.' })
                                                                            // let APIID = trans_res.ApiTransID
                                                                            this.checkStatus(transId, Mobile, name, amt, commision, commison_Type);

                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    })
                                                }).on('error', (err) => {
                                                    console.log(err)
                                                })
                                        }
                                        if(Otype == 'Gas Cylinder'){
                                            let Other_Values = ''
                                            https.get(`https://cyrusrecharge.in/api/recharge.aspx?memberid=${memberId}&pin=${APIkey}&number=${tranNo}
                                                    &operator=${operatorCode}&circle=${circleCode}&amount=${amt}&othervalue=${Other_Values}&othervalue1=${Other_Values}
                                                    &othervalue2=${Other_Values}&othervalue3=${Other_Values}&othervalue4=${Other_Values}&usertx=${transId}&account=&format=json`, 
                                                    (resp)=>{
                                            let Tran_data = "";

                                            resp.on('data',(chunck)=>{
                                                Tran_data += chunck
                                            })

                                            resp.on('end',()=>{
                                                console.log(Tran_data);
                                                let trans_res = JSON.parse(Tran_data);
                                                wallet.updateOne({'mobile':Mobile},{$inc:{'walletBal':-amt}},(err)=>{
                                                    if(err){
                                                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                    }
                                                    else{
                                                        let ins = new statement({'mobile':Mobile,'name':name, 'transId':transId, 'status':'Pending', 'amt':amt, 'date':Date.now(),
                                                                                    'amtType': amtType, 'opreatorName':operator, 'operatorCode':operatorCode, 'transName':'Recharge/Bill Payment', 'tranType':'Debit',
                                                                                    'remark':`Recharge/Bill payment transaction accepted.`})
                                                        ins.save((err)=>{
                                                            if(err){
                                                                res.json({'err':1,'msg':'Internal server error. Please try again later!!!!'})
                                                            }
                                                            else{
                                                                if(trans_res.Status == "Failure" || trans_res.Status == "FAILURE"){
                                                                    let new_transID = "S"+Date.now()
                                                                    statement.updateOne({'mobile':Mobile,'transId':transId},{'status':'Failure','remark':'Recharge/Bill payment transaction failed.',
                                                                        'tranRes':trans_res},(err)=>{
                                                                        if(err){
                                                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                        }
                                                                        else{
                                                                            wallet.updateOne({'mobile':Mobile},{$inc:{'walletBal':amt}},(err)=>{
                                                                                if(err){
                                                                                    res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                                }
                                                                                else{
                                                                                    let ins_sat = new statement({'mobile':Mobile,'name':name, 'transId':new_transID, 'status':'Succesful', 'amt':amt, 'date':Date.now(),
                                                                                    'amtType': amtType, 'opreatorName':'Wallet funds', 'transName':'Refunded', 'tranType':'credit',
                                                                                    'remark':'Funds succesfully refunded to wallet'})

                                                                                    ins_sat.save((err)=>{
                                                                                        if(err){
                                                                                            res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                                                                                        }
                                                                                        else{
                                                                                            res.json({'err':3,'msg':trans_res.ErrorMessage})
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                                if(trans_res.Status == "Success"){
                                                                    this.success(transId,Mobile,name,trans_res,amt,commision,commison_Type)
                                                                }
                                                                if(trans_res.Status == "Pending"){
                                                                    res.json({'err':0,'msg':'Transaction initiated.'})
                                                                    // let APIID = trans_res.ApiTransID
                                                                    this.checkStatus(transId,Mobile,name,amt,commision,commison_Type);
                                                                    
                                                                }
                                                            }
                                                        })
                                                    }
                                                })
                                            })
                                        }).on('error',(err)=>{
                                            console.log(err)
                                        })
                                        }
                                        else{
                                            console.log('this is working')
                                        }
                                    }
                                })
                            }
                        })
                    }).on('error', (err)=>{
                        console.log(err)
                        res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
                    })
                }
                else{
                    res.json({'err':2, 'msg':'Low wallet Balance. Please Add funds to your wallet'})
                }
            }
        })
    },

    fetchOpDet:function(req,res){
        let operator = req.body.operator
        let operatorCode = req.body.operatorCode

        service.findOne({'operator_Name':operator,'operator_Code':operatorCode},(err,data)=>{
            if(err){
                res.json({'err':1,'msg':'Internal server error. Please try again later!!!'})
            }
            else{
                res.json({'err':0,'msg':'done','data':data});
            }
        })
    },

    checkStatus:function(transId,mobile,name,amt,commision,commison_Type){
        let ne_transId = "S"+Date.now()
        https.get(`https://cyrusrecharge.in/api/rechargestatus.aspx?memberid=${memberId}&pin=${APIkey}&transid=${transId}&format=json`,(res)=>{
            data = "";

            res.on('data',(chunck)=>{
                data += chunck
            })

            res.on('end',()=>{
                let status_data = JSON.parse(data)
                console.log(status_data)
                if(status_data.Status == "Failure" || status_data.Status == "FAILURE"){
                    statement.find({'mobile':mobile,'transId':transId,'status':'Failure'},(err,data)=>{
                        if(err){
                            console.log(err)
                        }
                        if(!data || data.length == 0){
                            statement.updateOne({'mobile':mobile,'transId':transId},{'status':'Faliure','remark':'Recharge/Bill payment transaction failed.',
                            'tranRes':status_data},(err)=>{
                            if(err){
                                console.log(err)
                            }
                            else{
                                wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':amt}},(err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        let ins_sat = new statement({'mobile':mobile,'name':name, 'transId':ne_transId, 'status':'Succesful', 'amt':amt, 'date':Date.now(),
                                        'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Refunded', 'tranType':'credit',
                                        'remark':'Funds succesfully refunded to wallet'})

                                        ins_sat.save((err)=>{
                                            if(err){
                                                console.log(err)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        }
                    })
                }
                if(status_data.Status == "Success"){
                    this.success(transId,mobile,name,status_data,amt,commision,commison_Type)
                }
                // if(status_data.Status == "Pending"){

                // }
            })
        }).on('error',(err)=>{
            console.log(err)
        })
    },

    success:function(transId,mobile,name,trans_res,amt,commision,commison_Type){
         
        statement.updateOne({'mobile':mobile,'transId':transId},{'status':'Success','remarks':'Recharge/Bill payment done successfully.','tranRes':trans_res},(err)=>{
            if(err){
                console.log(err)
            }
            else{
                profile.findOne({'mobile':mobile},(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        let type = data.account_Type
                        if(type == "Premium"){
                            if(commison_Type == "Percentage"){
                                let commision_amt = parseFloat((amt * commision)/100).toFixed(2);
                                let cashback_Amt = parseFloat(commision_amt * 0.8).toFixed(2);
                                let cashback = parseFloat(cashback_Amt * 0.5).toFixed(2);
                                let transId = "S"+Date.now()
                                let ins = new statement({'mobile':mobile,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                                'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                                'remark':'Cashback succesfully added to wallet'})
                                ins.save((err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                // level.updateOne({})
                                                this.success1(mobile,cashback_Amt,commision_amt)
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                let cashback_Amt = parseFloat(commision * 0.8).toFixed(2);
                                let cashback = parseFloat(cashback_Amt * 0.5).toFixed(2);
                                let transId = "S"+Date.now()
                                let ins = new statement({'mobile':mobile,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                                'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                                'remark':'Cashback succesfully added to wallet'})
                                ins.save((err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                this.success1(mobile,cashback_Amt,commision)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else{
                            if(commison_Type == "Percentage"){
                                let commision_amt = parseFloat((amt * commision)/100).toFixed(2);
                                let cashback_Amt = parseFloat(commision_amt * 0.8).toFixed(2);
                                let free = parseFloat(cashback_Amt * 0.5).toFixed(2);
                                let cashback = parseFloat(free * 0.8).toFixed(2);
                                let transId = "S"+Date.now()
                                let ins = new statement({'mobile':mobile,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                                'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                                'remark':'Cashback succesfully added to wallet'})
                                ins.save((err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                this.success1(mobile,cashback_Amt,commision_amt)
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                let cashback_Amt = parseFloat(commision * 0.8).toFixed(2);
                                let free = parseFloat(cashback_Amt * 0.5).toFixed(2);
                                let cashback = parseFloat(free * 0.8).toFixed(2);
                                let transId = "S"+Date.now()
                                let ins = new statement({'mobile':mobile,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                                'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                                'remark':'Cashback succesfully added to wallet'})
                                ins.save((err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        wallet.updateOne({'mobile':mobile},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                this.success1(mobile,cashback_Amt,commision)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })
    },
    success1:function(mobile,cashback_Amt,commision_amt){
        let transId = "S"+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                let sponser = data.sponser_Number
                profile.findOne({'mobile':sponser},(err,data2)=>{
                    if(err){
                        console.log(err)
                    }
                    if(!data2 || data2.length == 0){
                        console.log('success Done')
                    }
                    else{
                        let name = data2.name
                        let type = data2.account_Type
                        
                        if(type == "Premium"){
                            let cashback = parseFloat(cashback_Amt * 0.2).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 1'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl1.mobile':mobile},{$inc:{'lvl1.$.earning.utility':cashback,
                                                                'lvl1.$.earning.utilityToday':cashback,'lvl1.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success2(sponser,cashback_Amt,commision_amt,mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            let free = parseFloat(cashback_Amt * 0.2).toFixed(2)
                            let cashback = parseFloat(free * 0.8).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 1'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl1.mobile':mobile},{$inc:{'lvl1.$.earning.utility':cashback,
                                            'lvl1.$.earning.utilityToday':cashback,'lvl1.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success2(sponser,cashback_Amt,commision_amt,mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    success2:function(mobile,cashback_Amt,commision_amt,T_mobile){
        let transId = "S"+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                let sponser = data.sponser_Number
                profile.findOne({'mobile':sponser},(err,data2)=>{
                    if(err){
                        console.log(err)
                    }
                    if(!data2 || data2.length == 0){
                        console.log('success Done')
                    }
                    else{
                        let name = data2.name
                        let type = data2.account_Type
                        
                        if(type == "Premium"){
                            let cashback = parseFloat(cashback_Amt * 0.1).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 2'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl2.mobile':mobile},{$inc:{'lvl2.$.earning.utility':cashback,
                                            'lvl2.$.earning.utilityToday':cashback,'lvl2.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success3(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            let free = parseFloat(cashback_Amt * 0.1).toFixed(2)
                            let cashback = parseFloat(free * 0.8).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 2'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl2.mobile':mobile},{$inc:{'lvl2.$.earning.utility':cashback,
                                            'lvl2.$.earning.utilityToday':cashback,'lvl2.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success3(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    success3:function(mobile,cashback_Amt,commision_amt,T_mobile){
        let transId = "S"+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                let sponser = data.sponser_Number
                profile.findOne({'mobile':sponser},(err,data2)=>{
                    if(err){
                        console.log(err)
                    }
                    if(!data2 || data2.length == 0){
                        console.log('success Done')
                    }
                    else{
                        let name = data2.name
                        let type = data2.account_Type
                        
                        if(type == "Premium"){
                            let cashback = parseFloat(cashback_Amt * 0.1).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 3'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl3.mobile':mobile},{$inc:{'lvl3.$.earning.utility':cashback,
                                            'lvl3.$.earning.utilityToday':cashback,'lvl3.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success4(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            let free = parseFloat(cashback_Amt * 0.1).toFixed(2)
                            let cashback = parseFloat(free * 0.8).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 3'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl3.mobile':mobile},{$inc:{'lvl3.$.earning.utility':cashback,
                                            'lvl3.$.earning.utilityToday':cashback,'lvl3.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success4(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    success4:function(mobile,cashback_Amt,commision_amt,T_mobile){
        let transId = "S"+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                let sponser = data.sponser_Number
                profile.findOne({'mobile':sponser},(err,data2)=>{
                    if(err){
                        console.log(err)
                    }
                    if(!data2 || data2.length == 0){
                        console.log('success Done')
                    }
                    else{
                        let name = data2.name
                        let type = data2.account_Type
                        
                        if(type == "Premium"){
                            let cashback = parseFloat(cashback_Amt * 0.05).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 4'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl4.mobile':mobile},{$inc:{'lvl4.$.earning.utility':cashback,
                                            'lvl4.$.earning.utilityToday':cashback,'lvl4.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success5(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            let free = parseFloat(cashback_Amt * 0.05).toFixed(2)
                            let cashback = parseFloat(free * 0.8).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 4'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl4.mobile':mobile},{$inc:{'lvl4.$.earning.utility':cashback,
                                            'lvl4.$.earning.utilityToday':cashback,'lvl4.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        this.success5(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    success5:function(mobile,cashback_Amt,commision_amt,T_mobile){
        let transId = "S"+Date.now()
        profile.findOne({'mobile':mobile},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                let sponser = data.sponser_Number
                profile.findOne({'mobile':sponser},(err,data2)=>{
                    if(err){
                        console.log(err)
                    }
                    if(!data2 || data2.length == 0){
                        console.log('success Done')
                    }
                    else{
                        let name = data2.name
                        let type = data2.account_Type
                        
                        if(type == "Premium"){
                            let cashback = parseFloat(cashback_Amt * 0.05).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 5'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl5.mobile':mobile},{$inc:{'lvl5.$.earning.utility':cashback,
                                            'lvl5.$.earning.utilityToday':cashback,'lvl5.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        // this.success3(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                        this.companyFunds(commision_amt);
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            let free = parseFloat(cashback_Amt * 0.05).toFixed(2)
                            let cashback = parseFloat(free * 0.8).toFixed(2)

                            let ins = new statement({'mobile':sponser,'name':name, 'transId':transId, 'status':'Succesful', 'amt':cashback, 'date':Date.now(),
                            'amtType': 'Balance', 'opreatorName':'Wallet funds', 'transName':'Cashback', 'tranType':'credit',
                            'remark':'Cashback succesfully added to wallet. For recharge/Bill payment on Tier 5'})

                            ins.save((err)=>{
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    wallet.updateOne({'mobile':sponser},{$inc:{'walletBal':cashback,'totalearning':cashback,'utility':cashback}},(err)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            level.updateOne({'mobile':sponser,'lvl5.mobile':mobile},{$inc:{'lvl5.$.earning.utility':cashback,
                                            'lvl5.$.earning.utilityToday':cashback,'lvl5.$.earning.utilityMonth':cashback}},(err)=>{
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                    else{
                                                                        // this.success3(sponser,cashback_Amt,commision_amt,T_mobile);
                                                                        this.companyFunds(commision_amt)
                                                                    }
                                                                })     
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    companyFunds:function(commision){
        let wallets = parseFloat(commision * 0.01).toFixed(2)
        wallet.updateOne({'mobile':9711855888},{$inc:{'walletBal':wallets}},(err)=>{
            if(err){
                console.log(err)
            }
            else{
                wallet.updateOne({'mobile':9354951735},{$inc:{'walletBal':wallets}},(err)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        wallet.updateOne({'mobile':9555047692},{$inc:{'walletBal':wallets}},(err)=>{
                            if(err){
                                console.log(err)
                            }
                            else{
                                wallet.updateOne({'mobile':7532866802},{$inc:{'walletBal':wallets}},(err)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        wallet.updateOne({'mobile':9999509088},{$inc:{'walletBal':wallets}},(err)=>{
                                            if(err){
                                                console.log(err)
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

    updatePending:function(){
        statement.find({'status':'Pending'},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                for(let i= 0; i<data.length; i++){
                    let transId = data[i].transId
                    let amt = data[i].amt
                    let mobile = data[i].mobile
                    let name = data[i].name
                    service.findOne({'operator_Name':data[i].opreatorName,'operator_Code':data[i].operatorCode},(err,data2)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            let commision = data2.commission
                            let commision_Type = data2.Percentage_Flat
                            this.checkStatus(transId,mobile,name,amt,commision,commision_Type)
                        }
                    })
                }
            }
        })
    },
    fetchTran:function(){
        https.request('https://cyrusrecharge.in/api/BillFetch_Cyrus_BA.aspx')
    }
}