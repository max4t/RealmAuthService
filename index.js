let config = require("./config");
config();

let realm = require("./realm");
let usecase = require("./usecase");
let restify = require('./api');

const log = console.log.bind(console)

async function main() {
    let db = await realm({
        url: `http://${config.realmHost}:${config.realmPort}`,
        user: config.realmUser,
        password: config.realmPassword,
        realm: `realm://${config.realmHost}:${config.realmPort}${config.realmPath}`,
        log: log
    });
    let core = await usecase({log: log}, db);
    await restify({port: 8080, log: log}, core);
}

main().catch(err => {
    log("EXITING");
    process.exit(1);
});
