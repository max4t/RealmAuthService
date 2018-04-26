let usecase = require("./usecase");

let mockDb = {
    findByEmail: async (email) => {
        if (email == "test@example") {
            return [
                {id: 5, email: "test@example", password: ""} // password = truc
            ]
        }
        return [];
    }
}

let core = await usecase({log: () => {}}, mockDb);

console.log("testing unknown email");
let id = await core.login("tt", "efsf");
if (id !== false) {
    console.log("fail");
    process.exit(1);
}

console.log("testing mismatched password");
let id = await core.login("test@example", "efsf");
if (id !== false) {
    console.log("fail");
    process.exit(1);
}
console.log("testing valid user");
let id = await core.login("test@example", "truc");
if (id !== 5) {
    console.log("fail");
    process.exit(1);
}
