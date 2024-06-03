module.exports = function(app) {
    app.post('/register', (req, res) => {
        var mail = req.body["email"];
        var mname = req.body["name"];
        var fname = req.body["firstname"];
        var pwd = req.body["password"];

    });
}