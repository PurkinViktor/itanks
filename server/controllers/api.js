var User = require('./UserModel.js');
exports.getAll = function(criteria, cb) {
    User.find(cb);
    // User.find(function(err, users) {
    //     res.send(threads);
    // });
};