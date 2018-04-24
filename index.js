let config = require("./config");
config();

let restify = require('restify');
let bcrypt = require('bcrypt');
let Realm = require('realm');

class InvalidUserError extends Error {
    constructor() {
        super({error: "invalid credentials"});
    }

    get statusCode() {
        return 403;
    }
}

console.log("starting server");

Realm.Sync.User.login(
    `http://${config.realmHost}:${config.realmPort}`,
    config.realmUser,
    config.realmPassword
).then(user => {
    console.log("realm user connect");
    return Realm.open({
        user: user,
        url: `realm://${config.realmPath}`
    });
}).catch(err => {
    console.error("failed to auth to realm with", config.realmUser, config.realmPassword);
    console.error("==> ERROR :", err);
    process.exit(1);
}).then(realm => {
    console.log("connected to realm");

    let server = restify.createServer();
    server.use(restify.plugins.bodyParser());
    
    server.post("/auth", (req, res, next) => {
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
    });

    
    server.listen(8080, () => {
        console.log("server listening on 8080");
    });
}).catch(err => {
    console.error("failed to connect to realm");
    console.error("==> ERROR :", err);
    process.exit(1);
});
