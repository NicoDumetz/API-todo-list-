const auth = require('../../middleware/auth');
const todo_query = require('./../todos/todos.query');
const notfound = require('../../middleware/notFound');

module.exports.todo_init = function(app) {
    app.post('/todos', auth.check_token, (req, res) => {
        var title = req.body["title"];
        var description = req.body["description"];
        var due_time = req.body["due_time"];
        var user_id = req.body["user_id"];
        var status = req.body["status"];

        if (title === undefined || description === undefined  || due_time === undefined || user_id === undefined || status === undefined)
            return res.status(500).json({"msg": "Bad parameter"})
        todo_query.create_todo(title, description, due_time, user_id, status, (err, success, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(200).json(user_info);
            return res.status(200).json(user_info);
        });
    });
};
