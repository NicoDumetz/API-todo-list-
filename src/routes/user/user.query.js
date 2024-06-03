const { connection: db } = require("../../config/db");
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

exports.pick_user = function(user_id, callback) {
    db.execute('SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?', [user_id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const user_info = results[0];
            const formatted_date = new Date(user_info.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            user_info.created_at = formatted_date;
            callback(null, user_info);
        } else {
            callback(null, null);
        }
    });
}

exports.user_todos = function(user_id, callback) {
    db.execute('SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE user_id = ?', [user_id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const todos_info = results;
            for (let i = 0; i < results.length; i++) {
                const formatted = new Date(todos_info[i].due_time).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                todos_info[i].due_time = formatted;
                const form = new Date(todos_info[i].created_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                todos_info[i].created_at = form;
            }
            callback(null, todos_info);
        } else {
            callback(null, null);
        }
    });
}

exports.pick_user_with_mail = function(mail, callback) {
    db.execute('SELECT id, email, password, created_at, firstname, name FROM user WHERE email = ?', [mail], (err, results) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        if (results.length > 0) {
            const user_info = results[0];
            const formatted_date = new Date(user_info.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            user_info.created_at = formatted_date;
            callback(null, user_info);
        } else {
            callback(null, null);
        }
    });
}

exports.pick_user_with_id = function(id, callback) {
    db.execute('SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?', [id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const user_info = results[0];
            const formatted_date = new Date(user_info.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            user_info.created_at = formatted_date;
            callback(null, user_info);
        } else {
            callback(null, null);
        }
    });
}

exports.delete_user_db = function(id, callback) {
    db.execute('DELETE FROM user WHERE id = ?', [id], (err, result) => {
        if (err)
            return callback(err);
        if (result.affectedRows > 0)
            return callback(null, true);
        else
            return callback(null, false);
    });
}

exports.update_user_with_id = function(id, mail, name, firstname, password, callback) {
    db.execute('UPDATE user SET email = ?, name = ?, firstname = ?, password = ? WHERE id = ?',
        [mail, name, firstname, password, id], (err, result) => {
        if (err)
            return callback(err);
        if (result.affectedRows > 0) {
            exports.pick_user(id, (err, user_info) => {
                if (err)
                    return callback(err);
                return callback(null, true, user_info);
            });
        } else {
            return callback(null, false, null);
        }
    });
};