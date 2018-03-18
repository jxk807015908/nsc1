
// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:4000/nsc";
//
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("数据库已创建!");
//   var dbase = db.db("nsc");
//   dbase.createCollection('site', function (err, res) {
//     if (err) throw err;
//     console.log("创建集合!");
//     db.close();
//   });
// });
const login=require('./login/login');
const checkUsername=require('./login/checkUsername');
const register=require('./login/register');
const getFriendGroup=require('./myFriend/getFriendGroup');
const getFriend=require('./myFriend/getFriend');
const getFriendMessage=require('./myFriend/getFriendMessage');
const sendMessage=require('./myFriend/sendMessage');
exports.handle=(app,connection)=>{
  // const mysql=require('mysql');
  // const connection=mysql.createConnection({
  //   host:'localhost',
  //   port:'3306',
  //   user:'root',
  //   password:'gw19950912',
  //   database:'nsc',
  // });
  // connection.connect();
  login.login(app,connection)
  checkUsername.checkUsername(app,connection)
  register.register(app,connection)
  getFriendGroup.getFriendGroup(app,connection)
  getFriend.getFriend(app,connection)
  getFriendMessage.getFriendMessage(app,connection)
  sendMessage.sendMessage(app,connection)
}

