const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const user_query = require('./../user/user.query');


module.exports.user = function(app) {
    app.get('/user', auth.check_token, (req, res) => {
        const user_id = req.user;

        user_query.display_user(user_id, (err, user_info) => {
            if (err)
                return res.status(500).json({ "msg": "Internal server error" });
            res.status(200).json(user_info);
        });
    });
};