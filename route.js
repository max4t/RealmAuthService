let bcrypt = require("bcrypt");

class InvalidUserError extends Error {
    constructor() {
        super({error: "invalid credentials"});
    }

    get statusCode() {
        return 403;
    }
}

function authHandler(realm)  {
    return (req, res, next) => {
        let email = req.body.email;
        let password = req.body.password;
        let users = realm.objects('User').filtered(`email = "${email}"`);
        if (users.length != 1) {
            return next(new InvalidUserError());
        }
        bcrypt.compare(password, users[0].password).then(isMatch => {
            if (!isMatch) {
                return next(new InvalidUserError());
            }
            res.send(200, {id: users[0].id});
        });
    }
}

module.exports = {
    authRoute: {
        method: "post",
        path: "/auth",
        handler: authHandler
    }
};
