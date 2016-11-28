var PORT = process.env.PORT || 5000;
var HOST = process.env.HOST || '0.0.0.0';


var express = require('express');
var http = require('http');
//var session = require("express-session");


var app = express();


var server = http.createServer(app);
server.listen(PORT, HOST);
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY1V', key: 'express.sid'}));

// app.configure(function () {
//     app.use(express.cookieParser());
//     app.use(express.session({secret: 'secret', key: 'express.sid'}));
//
// });


app.use('/static', express.static(__dirname + '/static'));
app.use('/client', express.static(__dirname + '/client'));
app.use('/GeneralClass', express.static(__dirname + '/GeneralClass'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var options = {
//    'log level': 0

};
var io = require('socket.io').listen(server, options);
var cookie = require('cookie');

io.set('authorization', function (data, accept) {
    // check if there's a cookie header
    console.log(data.query);
    var login = data.query.login;
    var password = data.query.password;

    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = cookie.parse(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
        data.sessionID = data.cookie['express.sid'];
        data.login = login || data.sessionID;
        data.password = password || "";
        //console.log("data.sessionID",data.sessionID);

    } else {
        // if there isn't, turn down the connection with a message
        // and leave the function.
        return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});

var serverGame = require('./gameModule/serverGame.js');

serverGame.start(io);
