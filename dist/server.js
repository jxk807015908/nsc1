var express = require('express'),
    app = express(),
    fs = require('fs'),
    server = require('http').createServer(app);
// var privateKey = fs.readFileSync('./ssl/nscprivate.pem', 'utf8');
// var certificate = fs.readFileSync('./ssl/nscfile.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
// let httpsServer = require('https').createServer(credentials, app);
let handleRequset=require('./handleRequset/handleRequset');
let socket=require('./socket/socket');
// httpsServer.listen(4001);
server.listen(4000);
app.use('/', express.static(__dirname));
socket.socket(server);
handleRequset.handle(app);

