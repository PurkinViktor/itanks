var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create a schema
var schema = new Schema({
    value: Schema.Types.Mixed,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
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
var Map = mongoose.model('Map', schema);
Map.getAll = function (cb) {

    var criteria = {};

    Map.find(criteria, function (err, items) {
        if (err) {
            console.log("error", err);
        }
        cb(err, items);
    });
};
Map.create = function (data, cb) {

    var newItem = Map({value: data});

    //var rez = newUser;
    newItem.save(function (err, product, numAffected) {
        if (err) {
            console.log("error", err);

        }

        cb(err, product);
    });
};
// make this available to our users in our Node applications
module.exports = Map;

