
let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/dashback_app",{useNewUrlParser: true, useUnifiedTopology: true});

module.exports={
    // registeration email
    regiEmail:function(res,mobile,name,email,id){
        res.json({'err':0,'msg':'Registered successfully','data':{'name':name,'mobile':mobile,'id':id}})
    },
    // registration otp
    regiOtp:function(){
        
    }
}