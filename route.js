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
        if (!("body" in req) || !("email" in req.body) || !("password" in req.body)) {
            // change to invalid parameter
            return next(new InvalidUserError());
        }
        const email = req.body.email;
        const password = req.body.password;
        const users = realm.objects('User').filtered(`email = "${email}"`);
        console.log("USERS", users);
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
