let express = require('express');
let bodyparser = require('body-parser');
var cron = require('node-cron')
let cors = require('cors');
let http = require('http');
let app=express();
app.use(express.static(__dirname+''))
const server=http.createServer(app);
app.use(cors());
app.use(bodyparser.json());

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:4200',
    'http://localhost:8101',
    'http://localhost:1234'
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }

cron.schedule('* * * * *',()=>{
  var conn = require('./controller/recharge');
  conn.updatePending();
})

cron.schedule('* * * * *',()=>{
  let amt = 0.44
  let cb = parseFloat(3.28 * 0.8).toFixed(2)
  console.log('cb',cb);
  let cbd = parseFloat((cb * 0.5)*0.8).toFixed(2)
  console.log('cbd',cbd);
  let cb1 = parseFloat((cb * 0.2)*0.8).toFixed(2)
  console.log('cb1',cb1)
  let cb2 = parseFloat((cb * 0.1)*0.8).toFixed(2)
  console.log('cb2',cb2)
  let cb3 = parseFloat((cb * 0.1)*0.8).toFixed(2)
  console.log('cb3',cb3)
  let cb4 = parseFloat((cb * 0.05)*0.8).toFixed(2)
  console.log('cb4',cb4)
  let cb5 = parseFloat((cb * 0.05)*0.8).toFixed(2)
  console.log('cb5',cb5)
})

app.post('/checkMob', cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.checkMob(req,res);
})

app.post('/addFirst',cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller')
    conn.addFirst(req,res)
})
app.post('/register', cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.register(req,res)
})

app.get('/checkSpon/:mob', cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.fetchSponsor(req,res);
})
app.get('/checkVer', cors(corsOptions),(req,res)=>{
    res.json({'err':0,'version':'1.1.558'})
})
app.post('/login', cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.login(req,res);
})
app.get('/fetchService/:type',cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.fetchService(req,res)
})
app.get('/fetchCricle', cors(corsOptions),(req,res)=>{
    var conn = require('./controller/controller');
    conn.fetchCircle(req,res);
})
app.get('/fetchTeam/:mob', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/controller');
  conn.fetchTeam(req,res);
})
app.post('/adTran', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/ad');
  conn.adTran(req,res);
})
app.get('/adCount/:mob', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/ad');
  conn.fetchCount(req,res);
})
app.get('/fetchTran/:mob', cors(corsOptions),(req,res)=>{
  var conn =require('./controller/controller');
  conn.fetchTran(req,res);
})
app.post('/addWalletAmt', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/wallet');
  conn.addWalletAmt(req,res);
})
app.get('/fetchBal/:mob', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/wallet');
  conn.fetchBal(req,res);
})
app.post('/recharge', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/recharge');
  conn.recharge(req,res);
})
app.post('/fetchOpDet', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/recharge');
  conn.fetchOpDet(req,res);
})
app.get('/fetchprofile/:mob', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/profile');
  conn.fetchProfile(req,res);
})
app.get('/premium/:mob', cors(corsOptions),(req,res)=>{
  var conn = require('./controller/premium');
  conn.premium(req,res);
})
server.listen(2702,()=>{
    console.log("Running at port 2702")
})


  