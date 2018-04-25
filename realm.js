let Realm = require("realm");

const UserSchema = {
    name: "User",
    properties: {
        id: 'int',
        email: 'string',
        password: 'string'
    }
};

module.exports.connect = (url, user, password, realm) => {
    return Realm.Sync.User.login(url, user, password).catch(err => {
        console.error("failed to auth to realm with", user, password);
        console.error("==> ERROR :", err);
        process.exit(1);
    }).then(user => {
        console.log("realm user connected");
        return Realm.open({
            schema: [UserSchema],
            sync: {
                user: user,
                url: realm,
                error: err => { throw (err); }
            }
        }).catch(err => {
            console.error("failed to connect to realm");
            console.error("==> ERROR :", err);
            user.logout();
            process.exit(1);
        });
    });
};

module.exports.disconnect = () => {
    if (Realm.Sync.User.current) {
        Realm.Sync.User.current.logout();
    }
}