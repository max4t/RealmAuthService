let config = require("./config");
config();

let routes = require("./route");
let realm = require("./realm");

let restify = require('restify');

console.log("starting server");

realm.connect(
    `http://${config.realmHost}:${config.realmPort}`,
    config.realmUser,
    config.realmPassword,
    `realm://${config.realmPath}`
).then(db => {
    console.log("connected to realm");

    let server = restify.createServer();
    server.use(restify.plugins.bodyParser());
    
    // register routes from ./route.js
    for (let routeParams of routes) {
        server[routeParams.method](routeParams.path, routeParams.handler(db));
    }
    
    server.listen(8080, () => {
        console.log("server listening on 8080");
    });
});
