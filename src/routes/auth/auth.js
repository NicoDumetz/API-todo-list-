const db = require('../../config/db');
const jwt = require('jsonwebtoken');

module.exports.register = function(app, bcrypt) {
    app.post('/register', (req, res) => {
        handle_register(req, res, bcrypt);
    });
};

function handle_register(req, res, bcrypt) {
    var email = req.body["email"];
    var name = req.body["name"];
    var firstname = req.body["firstname"];
    var password = req.body["password"];

    if (!email || !name || !firstname || !password)
        return res.status(500).json({"msg":"internal server error"});
    if (!/@/.test(email))
        return res.status(500).json({"msg":"Invalid email format"});
    already_exist(email, (err, userExists) => {
        if (err)
            return res.status(500).json({"msg": "Internal server error"});
        if (userExists)
            return res.status(500).json({"msg":"Account already exists"});
        const hash = bcrypt.hashSync(password, 10);
        insert_user_db(email, hash, name, firstname, (err, token) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            res.status(200).json({token});
        });
    });
}

function already_exist(email, callback) {
    db.execute('SELECT id FROM `user` WHERE email = ?', [email], (err, results, fields) => {
        if (err)
            return callback(err, null);
        const user_exist = results.length > 0;
        callback(null, user_exist);
    });
}

function insert_user_db(email, hash, name, firstname, callback) {
    db.execute('INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)', [email, hash, name, firstname], (err, results, fields) => {
        if (err)
            return callback(err);
        const token = jwt.sign({ email, password: hash}, process.env.SECRET);
        callback(null, token);
    });
}

module.exports.login = function(app, bcrypt) {
    app.post('/login', (req, res) => {
        handle_login(req, res, bcrypt);
    });
};

function handle_login(req, res, bcrypt) {
    const email = req.body["email"];
    const password = req.body["password"];

    if (!email || !password)
        return res.status(500).json({"msg":"internal server error"});

    get_user(email, (err, user) => {
        if (err)
            return res.status(500).json({"msg": "Internal server error"});
        if (!user)
            return res.status(401).json({"msg":"Invalid Credentials"});
        bcrypt.compare(password, user.password, (err, result) => {
            if (err)
                return res.status(500).json({"msg": "Internal server error"});
            if (result) {
                const token = jwt.sign({ email, id: user.id }, process.env.SECRET);
                res.json({token});
            } else
                res.status(401).json({"msg":"Invalid Credentials"});
        });
    });
}

function get_user(email, callback) {
    db.execute('SELECT password, id FROM `user` WHERE email = ?', [email], (err, results, fields) => {
        if (err)
            return callback(err, null);
        const user = results[0];
        callback(null, user);
    });
}
