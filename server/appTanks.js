var PORT = 8008;

var options = {
//    'log level': 0
};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT);

app.use('/static', express.static(__dirname + '/static'));
app.use('/client', express.static(__dirname + '/client'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});



var serverGame = require('./serverGame.js').serverGame;

serverGame.start(io);
