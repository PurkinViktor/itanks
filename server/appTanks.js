var PORT = process.env.PORT || 5000;
var HOST = process.env.HOST || '0.0.0.0';
var options = {
//    'log level': 0

};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT, HOST);

app.use('/static', express.static(__dirname + '/static'));
app.use('/client', express.static(__dirname + '/client'));
app.use('/GeneralClass', express.static(__dirname + '/GeneralClass'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


var serverGame = require('./gameModule/serverGame.js');

serverGame.start(io);
