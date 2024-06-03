const{ connection: db } = require("../../config/db");
const { user } = require("../user/user");


exports.pick_todo = function(user_id, callback) {
    db.execute('SELECT title, description, due_time, user_id, status  FROM todo WHERE user_id = ?', [user_id], (err, results) => {
        if (err)
            return callback(err, null);
        if (results.length > 0) {
            const todo_info = results[0];
            const formatted_date = new Date(todo_info.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            todo_info.created_at = formatted_date;
            const formatted = new Date(todo_info.due_time).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            todo_info.due_time = formatted;
            callback(null, todo_info);
        } else {
            callback(null, null);
        }
    });
}

module.exports.pick_all_todos = function(callback) {
    db.execute('SELECT id, title, description,  created_at, due_time, user_id, status FROM todo', (err, results) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        if (results.length > 0) {
            const todos_info = results;
            const formatted_date = new Date(todo_info.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            todo_info.created_at = formatted_date;
            const formatted = new Date(todo_info.due_time).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            todo_info.due_time = formatted;
            callback(null, todos_info);
        } else {
            callback(null, null);
        }
    });
}

module.exports.todo_id = function(id, callback) {
    db.execute('SELECT id, title, description,  created_at, due_time, user_id, status FROM todo WHERE id = ?', [id], (err, results) => {
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

module.exports.todo_disp_update = function(id, callback) {
    db.execute('SELECT id, title, description, due_time, user_id, status FROM todo WHERE id = ?', [id], (err, results) => {
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

exports.update_todo = function(id, title, description, due_time, user_id, status, callback) {
    db.execute('UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?',
    [title, description, due_time, user_id, status, id], (err, result) => {
        if (err)
            return callback(err);
        if (result.affectedRows > 0) {
            exports.todo_disp_update(id, (err, user_info) => {
                if (err)
                    return callback(err);
                return callback(null, true, user_info);
            });
        } else {
            return callback(null, false, null);
        }
    });
}