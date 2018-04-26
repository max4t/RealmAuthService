// returns an async function that launchs the server on 'config.port'

let restify = require("restify");

class InvalidUserError extends Error {
    constructor() {
        super({error: "invalid credentials"});
    }

    get statusCode() {
        return 403;
    }
}

module.exports = async (config, core) => {
    const server = restify.createServer();
    server.use(restify.plugins.bodyParser());

    config.log("registering routes");
    server.post("/auth", (req, res, next) => {
        if (!("body" in req) || !("email" in req.body) || !("password" in req.body)) {
            // change to invalid parameter
            config.log("invalid request");
            return next(new InvalidUserError());
        }
        core.login(req.body.email, req.body.password).then(id => {
            if (id === false) {
                config.log("invalid credentials");
                return next(new InvalidUserError());
            }
            res.send(200, {id: id});
            config.log("valid user");
        }).catch(err => {
            config.log("res error", err);
            res.send(500);
        });
    });

    server.listen(config.port, () => {
        config.log(`server listening on ${config.port}`);
    });
}