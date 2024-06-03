var db = require('../../config/db');


exports.pick_todo = function(user_id, callback) {
    db.execute('SELECT title, description, due_time, user_id, status  FROM todo WHERE user_id = ?', [user_id], (err, results) => {
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

module.exports.pick_all_todos = function(callback) {
    db.execute('SELECT * FROM todo', (err, results) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        if (results.length > 0) {
            const todos_info = results;
            callback(null, todos_info);
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
                exports.pick_todo(user_id, (err, todo_info) => {
                    if (err)
                        return callback(err);
                    return callback(null, true, todo_info);
                });
            } else {
                return callback(null, false, null);
            }
        }
    );
};

exports.delete_todo_db = function(id, callback) {
    db.execute('DELETE FROM todo WHERE id = ?', [id], (err, result) => {
        if (err)
            return callback(err);
        if (result.affectedRows > 0)
            return callback(null, true);
        else
            return callback(null, false);
    });
}