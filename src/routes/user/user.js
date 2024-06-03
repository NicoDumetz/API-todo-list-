const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const user_query = require('./../user/user.query');


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
    app.get('/user/:value', auth.check_token, (req, res) => {
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
    app.delete('/user/:id', auth.check_token, (req, res) => {
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
    app.put('/user/:id', auth.check_token, (req, res) => {
        const id = req.params.id;
        var mail = req.body["email"];
        var name = req.body["name"];
        var firstname = req.body["firstname"];
        var password = req.body["password"];

        if (id === undefined || mail === undefined || name === undefined  || firstname === undefined || password === undefined)
                return res.status(500).json({"msg": "Bad parameter"});
        password = bcrypt.hashSync(password, 10);
        user_query.update_user_with_id(id, mail, name, firstname, password, (err, success, user_info) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (success)
                return res.status(200).json(user_info);
        });
    });
};