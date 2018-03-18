var express = require('express'),
    app = express(),
    server = require('http').createServer(app);
let handleRequset=require('./handleRequset/handleRequset')
let socket=require('./socket/socket');
const mysql=require('mysql');
const connection=mysql.createConnection({
  host:'localhost',
  port:'3306',
  user:'root',
  password:'gw19950912',
  database:'nsc',
});
connection.connect();
app.use('/', express.static(__dirname));
server.listen(4000);
socket.socket(server,connection);
handleRequset.handle(app,connection);

