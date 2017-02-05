var User = require('../models/UserModel.js');

// var db = require('../db');
var crypto = require('crypto');

var hash = function (password) {
    return crypto.createHash('sha256').update(password).digest('base64');
};

exports.getAll = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            console.log("error", err);
        }
        // object of all the users
        console.log(users);
        res.send(users);
    });
    // User.find(function(err, users) {
    //     res.send(threads);
    // });
};

exports.logIn = function (req, res) {


    User.logIn(req.body.login, req.body.password, function (err, user) {
        if (err) {
            console.log("error", err);
        } else {
            if (user) {
                req.session.user = user;
            }
        }
        res.send(req.session.user);
    });


};
exports.logOut = function (req, res) {
    req.session.user = null;
    res.send(req.session.user);
};
exports.create = function (req, res) {

    var newUser = User(req.body);

    newUser.password = hash(newUser.password);

    // req.params
    // req.body
    // req.query

    //newUser.name = "";

// save the user
    var rez = newUser;
    newUser.save(function (err) {
        if (err) {
            console.log("error", err);
            rez = err;
        }

        res.send(rez);
    });

};