const jwt = require('jsonwebtoken');

module.exports.check_token = function(req, res, next) {
    const token = extract_token(req.headers.authorization);

    if (token) {
        verify_token(token, (err, user) => {
            if (err)
                return res.status(498).json({"msg":"Token is not valid"});
            req.user = user.id;
            next();
        });
    } else {
        res.status(498).json({"msg":"No token , authorization denied"});
    }
};

function extract_token(header) {
    if (header)
        return header.split(' ')[1];
    return null;
}

function verify_token(token, callback) {
    jwt.verify(token, process.env.SECRET, (err, user) => {
        callback(err, user);
    });
}
