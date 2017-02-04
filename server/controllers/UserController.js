var User = require('../models/UserModel.js');

// var db = require('../db');
// var crypto = require('crypto');
//
// var hash = function (password) {
//     return crypto.createHash('sha1').update(password).digest('base64')
// };

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

exports.create = function (req, res) {

    var newUser = User(req.body);

    // req.params
    // req.body
    // req.query

    newUser.name = "Виктор 1";

// save the user
    newUser.save(function (err) {
        if (err) {
            console.log("error", err);
        }

        res.send(newUser);
    });

};