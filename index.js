let config = require("./config");
config();

let routes = require("./route");

let restify = require('restify');
let Realm = require('realm');


console.log("starting server");

Realm.Sync.User.login(
    `http://${config.realmHost}:${config.realmPort}`,
    config.realmUser,
    config.realmPassword
).catch(err => {
    console.error("failed to auth to realm with", config.realmUser, config.realmPassword);
    console.error("==> ERROR :", err);
    process.exit(1);
}).then(user => {
    console.log("realm user connect");
    return Realm.open({
        user: user,
        url: `realm://${config.realmPath}`
    });
}).then(realm => {
    console.log("connected to realm");

    let server = restify.createServer();
    server.use(restify.plugins.bodyParser());
    
    // register routes from ./route.js
    for (let routeParams of routes) {
        server[routeParams.method](routeParams.path, routeParams.handler);
    }
    
    server.listen(8080, () => {
        console.log("server listening on 8080");
    });
}).catch(err => {
    console.error("failed to connect to realm");
    console.error("==> ERROR :", err);
    process.exit(1);
});
