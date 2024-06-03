const jwt = require('jsonwebtoken');

module.exports.check_token = function(req, res, next) {
    const token = extract_token(req.headers.authorization);

    if (token) {
        verifyToken(token, (err, user) => {
            if (err) {
                return res.status(498).json({"msg":"Token is not valid"});
            }
            req.user = user.id;
            next();
        });
    } else {
        res.status(498).json({"msg":"No token , authorization denied"});
    }
};

function extract_token(authHeader) {
    if (authHeader) {
        return authHeader.split(' ')[1];
    }
    return null;
}

function verifyToken(token, callback) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        callback(err, user);
    });
}
