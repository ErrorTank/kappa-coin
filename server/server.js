require("dotenv").config({ path: "./env/dev.env"});
const configExpressServer = require("./config/express");
const routerConfig = require("./config/routes");
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = configExpressServer({useCors: true});
const initDb = require("./config/db");
const {createNamespaceIO} = require("./config/socket/socket-io");

initDb().then(db => {

    let server = https.createServer(
        {
            key: fs.readFileSync(
                path.join(
                    __dirname,
                    `./ssl/${process.env.NODE_ENV}/${process.env.SSL_KEY_PATH}`
                )
            ),
            cert: fs.readFileSync(
                path.join(
                    __dirname,
                    `./ssl/${process.env.NODE_ENV}/${process.env.SSL_CRT_PATH}`
                )
            )
        },
        app
    );
    const namespacesIO = createNamespaceIO(server, {db});
    app.use("/", routerConfig(db, namespacesIO));
    app.use(require("./utils/error/error-handlers"));

    server.listen(process.env.PORT, () => {
        console.log(`Server running on port: ${process.env.PORT}`)
    });
}).catch(err => {
    console.error("Unable to connect to db:",err);
});

