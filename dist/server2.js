var express = require('express'),
  app = express(),
  fs = require('fs');
var privateKey = fs.readFileSync('./ssl/nscprivate.pem', 'utf8');
var certificate = fs.readFileSync('./ssl/nscfile.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
let httpsServer = require('https').createServer(credentials, app);
let handleRequset=require('./handleRequset/handleRequset');
let socket=require('./socket/socket');
httpsServer.listen(4001);
app.use('/', express.static(__dirname));
socket.socket(httpsServer);
handleRequset.handle(app);
