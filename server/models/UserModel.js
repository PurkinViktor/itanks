var crypto = require('crypto');

var hash = function (password) {
    return crypto.createHash('sha256').update(password).digest('base64');
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create a schema
var userSchema = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    name: {type: String},
    admin: Boolean,
    email: String,
    meta: {
        age: Number,
        website: String
    },
    created_at:  {type: Date, default: Date.now},
    updated_at:  {type: Date, default: Date.now}
});

// userSchema.methods.logIn = function (login, password, cb) {
//     var criteria = {login: login, password: hash(password)};
//
//
//     var rez = null;
//     User.find(criteria, function (err, users) {
//         if (err) {
//             console.log("error", err);
//         }else {
//             if (users.length > 0) {
//                 rez = users[0];
//             }
//         }
//         cb(err, rez);
//     });
// };



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
User.logIn = function (login, password, cb) {
    var criteria = {login: login, password: hash(password)};


    var rez = null;
    User.find(criteria, function (err, users) {
        if (err) {
            console.log("error", err);
        }else {
            if (users.length > 0) {
                rez = users[0];
            }
        }
        cb(err, rez);
    });
};
// make this available to our users in our Node applications
module.exports = User;