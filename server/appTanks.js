var PORT = 18320;
//var port = process.env.PORT || 3000;

var options = {
//    'log level': 0
};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT, "127.0.0.1");

app.use('/static', express.static(__dirname + '/static'));
app.use('/client', express.static(__dirname + '/client'));
app.use('/GeneralClass', express.static(__dirname + '/GeneralClass'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


var serverGame = require('./gameModule/serverGame.js');

serverGame.start(io);
