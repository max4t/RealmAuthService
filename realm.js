// This module returns a function like this : (config) => Promise<Repo>
// Repo is the interface used by the usecase to fetch the data

let Realm = require("realm");

const UserSchema = {
    name: "User",
    properties: {
        id: 'int',
        email: 'string',
        password: 'string'
    }
};

class ConfigError extends Error {}

function validateConfig(config) {
    config = config || {};
    const c = ["url", "user", "password", "realm"].reduce((acc, v) => {
        if (!(v in config) || typeof config[v] !== "string") {
            throw new ConfigError(`invalid ${v}`);
        }
        acc[v] = config[v];
        return acc;
    }, {});
    c.log = typeof config.log === "function" ? config.log : () => {};
    return c;
}

class Repo {
    constructor(realm, log) {
        this.realm = realm;
        this.log = log;
    }

    async findByEmail(email) {
        this.log(`Repo.findByEmail(${email})`);
        return this.realm.objects('User').filtered(`email = "${email}"`);
    }
}

module.exports = async (config) => {
    const c = validateConfig(config || {});
    c.log("connecting to realm");
    const user = await Realm.Sync.User.login(c.url, c.user, c.password);
    c.log("user authenticated to realm");
    const r = await Realm.open({
        //schema: [UserSchema],
        sync: {
            user: user,
            url: c.realm,
            error: err => {
                c.log("realm error:", err);
            }
        }
    });
    c.log("realm connected");
    return new Repo(r, c.log);
}
