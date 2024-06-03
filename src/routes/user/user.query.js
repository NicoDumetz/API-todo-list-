var db = require('../../config/db');
const jwt = require('jsonwebtoken');

exports.get_user = function(email, callback) {
    db.execute('SELECT password, id FROM `user` WHERE email = ?', [email], (err, results) => {
        if (err)
            return callback(err, null);
        const user = results[0];
        callback(null, user);
    });
}

exports.insert_user_db = function(email, hash, name, firstname, callback) {
    db.execute('INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)', [email, hash, name, firstname], (err) => {
        if (err)
            return callback(err);
        const token = jwt.sign({ email, password: hash}, process.env.SECRET);
        callback(null, token);
    });
}

exports.already_exist = function(email, callback) {
    db.execute('SELECT id FROM `user` WHERE email = ?', [email], (err, results) => {
        if (err)
            return callback(err, null);
        const user_exist = results.length > 0;
        callback(null, user_exist);
    });
}

exports.display_user = function(user_id, callback) {
    db.execute('SELECT * FROM user WHERE id = ?', [user_id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const userInfo = results[0];
            callback(null, userInfo);
        } else {
            callback(null, null);
        }
    });
}
