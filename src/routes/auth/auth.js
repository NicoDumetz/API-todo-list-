const db = require('../../config/db');
const jwt = require('jsonwebtoken');

module.exports.register = function(app, bcrypt) {
    app.post('/register', (req, res) => {
        var mail = req.body["email"];
        var name = req.body["name"];
        var first_name = req.body["firstname"];
        var pwd = req.body["password"];

        if (mail === undefined || name === undefined  ||
            first_name === undefined || pwd === undefined) {
                res.status(500).json({"msg":"internal server error"});
                return;
        }
        pwd = bcrypt.hashSync(pwd, 10);
        db.execute('INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)', [mail, pwd, name, first_name], function(err, results, fields) {
            const token = jwt.sign({email:mail, password:pwd}, process.env.SECRET);
            res.status(200).json({token});
            return;
        })
    });
};

module.exports.login = function(app, bcrypt) {
    app.post('/login', (req, res) => {
        var mail = req.body["email"];
        var pwd = req.body["password"];

        if (mail === undefined || pwd === undefined) {
            res.status(500).json({"msg":"internal server error"});
            return;
        }
        db.execute('SELECT password, id FROM `user` WHERE email = ?', [mail], function(err, results, fields) {
            const user = results[0];
            const store = user.password;
            bcrypt.compare(pwd, store, function(err, result) {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    res.status(500).json({"msg": "Internal server error"});
                    return;
                }
                if (result) {
                    const id = user.id;
                    const token = jwt.sign({mail: mail, id: id}, process.env.SECRET);
                    res.json({token});
                } else {
                    res.status(401).json({"msg": "Invalid email or password"});
                }
            });
        })
    });
};
