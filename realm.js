let Realm = require("realm");

module.exports.connect = (url, user, password, realm) => {
    return Realm.Sync.User.login(url, user, password).catch(err => {
        console.error("failed to auth to realm with", config.realmUser, config.realmPassword);
        console.error("==> ERROR :", err);
        process.exit(1);
    }).then(user => {
        console.log("realm user connected");
        return Realm.open({
            user: user,
            url: realm
        });
    }).catch(err => {
        console.error("failed to connect to realm");
        console.error("==> ERROR :", err);
        process.exit(1);
    });
};
