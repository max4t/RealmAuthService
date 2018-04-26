// returns an async function which returns a interface UseCase
// only one usecase 'login'. returns false if invalid credentials or the user id. forward errors from the db if any

let bcrypt = require("bcrypt");

class UseCase {
    constructor(db, log) {
        this.db = db;
        this.log = log;
    }
    async login(email, password) {
        let users = await this.db.findByEmail(email);
        if (!users) {
            this.log(`found no user`);
            return false;
        }
        if (users.length !== 1) {
            this.log(`found ${users.length} users`);
            return false;
        }
        if (!await bcrypt.compare(password, users[0].password)) {
            this.log("mismatched password");
            return false;
        }
        this.log("found valid user");
        return users[0].id;
    }
}

module.exports = (config, db) => { // TODO handle config {db,log}
    return new UseCase(db, config.log);
}
