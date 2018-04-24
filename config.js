module.exports = () => {
    [
        "realm host",
        "realm port",
        "realm user",
        "realm password",
        "realm path",
    ].forEach(v => {
        var envName = v.toUpperCase().replace(" ", "_");
        var appName = v.split(" ").reduce((acc, val) => acc.length == 0 ? val : (acc + val.charAt(0).toUpperCase() + val.slice(1)));
        if (!(envName in process.env)) {
            console.error(`${v} must be set`);
            process.exit(1);
            return;
        }
        module.exports[appName] = process.env[envName];
    });
};
