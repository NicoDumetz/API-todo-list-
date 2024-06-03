var db = require('../config/db')

module.exports.check_id = function(req, res, next) {
    var id = req.params.id;

    db.execute('SELECT * FROM todo WHERE id = ?', [id], (err, results) => {
        if (err)
            return res.status(500).json({"msg": "Internal server error"});
        if (results.length <= 0)
            return res.status(404).json({"msg":"Not found"});
        next();
    });
};