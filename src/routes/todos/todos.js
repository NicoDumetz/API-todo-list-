const auth = require('../../middleware/auth');
const todo_query = require('./../todos/todos.query');
const notfound = require('../../middleware/notFound');

module.exports.todo_init = function(app) {
    app.post('/todos', auth.check_token, (req, res) => {
        let title = req.body["title"];
        let description = req.body["description"];
        let due_time = req.body["due_time"];
        let user_id = req.body["user_id"];
        let status = req.body["status"];

        if (title === undefined || description === undefined  || due_time === undefined || user_id === undefined || status === undefined)
            return res.status(400).json({"msg": "Bad parameter"})
        todo_query.create_todo(title, description, due_time, user_id, status, (err, success, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(201).json(user_info);
            return res.status(404).json({"msg": "Not found"});
        });
    });
};

module.exports.todo_delete = function(app) {
    app.delete('/todos/:id', auth.check_token, notfound.check_id, (req, res) => {
        const id = req.params.id;

        todo_query.delete_todo_db(id, (err, success) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(200).json({"msg": `Successfully deleted record number: ${id}`});
            return res.status(404).json({"msg": "Not found"});
        });
    });
};

module.exports.todo_query = function(app) {
    app.get('/todos', auth.check_token, (req, res) => {
        todo_query.pick_all_todos((err, todos_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            res.status(200).json(todos_info);
        });
    });
};

module.exports.todo_with_id = function(app) {
    app.get('/todos/:id', auth.check_token, notfound.check_id, (req, res) => {
        let id = req.params.id;

        todo_query.todo_id(id, (err, todos_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            res.status(200).json(todos_info[0]);
        });
    });
};

module.exports.update_todo = function(app) {
    app.put('/todos/:id', auth.check_token, notfound.check_id, (req, res) => {
        let id = req.params.id;
        let title = req.body["title"];
        let description = req.body["description"];
        let due_time = req.body["due_time"];
        let user_id = req.body["user_id"];
        let status = req.body["status"];

        if (title == undefined || description  == undefined || due_time  == undefined || user_id  == undefined || status == undefined)
                return res.status(400).json({"msg": "Bad parameter"});

        todo_query.update_todo(id, title, description, due_time, user_id, status, (err, success, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(200).json(user_info[0]);
            return res.status(404).json({"msg": "Not found"});
        });
});
};