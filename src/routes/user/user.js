const auth = require('../../middleware/auth');
const user_query = require('./../user/user.query');

module.exports.user_todos = function(app) {
    app.get('/user/todos', auth.check_token, (req, res) => {
        const id = req.user;

        user_query.user_todos(id, (err, todos_info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({"msg": "Internal server error"});
            }
            res.status(200).json(todos_info);
        });
    });
};

module.exports.user = function(app) {
    app.get('/user', auth.check_token, (req, res) => {
        const user_id = req.user;

        user_query.pick_user(user_id, (err, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            res.status(200).json(user_info);
        });
    });
};

module.exports.user_with_data = function(app) {
    app.get('/users/:value', auth.check_token, (req, res) => {
        const value = req.params.value;

        user_query.pick_user_with_mail(value, (err, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (user_info)
                return res.json(user_info);
            else {
                user_query.pick_user_with_id(value, (err, userinfoid) => {
                    if (err)
                        return res.status(500).json({"msg": "Internal server error"});
                    if (userinfoid) {
                        return res.json(userinfoid);
                    } else
                        return res.status(404).json({"msg": "User not found"});
                });
            }
        });

    });
};

module.exports.delete_user = function(app) {
    app.delete('/users/:id', auth.check_token, (req, res) => {
        const id = req.params.id;

        user_query.delete_user_db(id, (err, success) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(200).json({"msg": `Successfully deleted record number: ${id}`});
        });
    });
};

module.exports.update_user = function(app, bcrypt) {
    app.put('/users/:id', auth.check_token, (req, res) => {
        const id = req.params.id;
        let mail = req.body["email"];
        let name = req.body["name"];
        let firstname = req.body["firstname"];
        let password = req.body["password"];

        if (id === undefined || mail === undefined || name === undefined  || firstname === undefined || password === undefined)
                return res.status(400).json({"msg": "Bad parameter"});
        password = bcrypt.hashSync(password, 10);
        user_query.update_user_with_id(id, mail, name, firstname, password, (err, success, user_info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({"msg": "Internal server error"});
            }
            if (success)
                return res.status(200).json(user_info);
        });
    });
};
