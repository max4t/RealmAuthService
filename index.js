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
    `realm://${config.realmHost}:${config.realmPort}${config.realmPath}`
).then(db => {
    console.log("connected to realm");

    let server = restify.createServer();
    server.use(restify.plugins.bodyParser());
    
    // register routes from ./route.js
    for (const [_, params] of Object.entries(routes)) {
        server[params.method](params.path, params.handler(db));
        console.log("Registered", params.method.toUpperCase(), params.path);
    }
    
    server.listen(8080, () => {
        console.log("server listening on 8080");
    });
}).catch(err => {
    realm.disconnect();
    console.error("exited unexpectedly");
    console.error("==> ERROR :", err);
    process.exit(1);
});
