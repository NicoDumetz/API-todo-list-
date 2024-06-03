var db = require('../../config/db');


exports.pick_todo = function(user_id, callback) {
    db.execute('SELECT title, description, due_time, user_id, status  FROM todo WHERE id = ?', [user_id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const todo_info = results[0];
            callback(null, todo_info);
        } else {
            callback(null, null);
        }
    });
}

module.exports.create_todo = function(title, description, due_time, user_id, status, callback) {
    db.execute( 'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
        [title, description, due_time, user_id, status],
        (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.affectedRows > 0) {
                exports.pick_todo(user_id, (err, user_info) => {
                    if (err)
                        return callback(err);
                    return callback(null, true, user_info);
                });
            } else {
                return callback(null, false, null);
            }
        }
    );
};