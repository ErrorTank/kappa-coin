require("dotenv").config({path: "./env/dev.env"});
const configExpressServer = require("./config/express");
const routerConfig = require("./config/routes");
const http= require("http");
const fs = require("fs");
const path = require("path");
const request = require("request");
const app = configExpressServer({useCors: true});
const {init} = require("./config/db");
const createPubSub = require("./config/pubsub");
const {createNamespaceIO} = require("./config/socket/socket-io");
const {updateBlockchainDetail} = require("./db/controller/chain");

init().then(db => {

    const Port = process.env.IS_DEFAULT === "true" ? Number(process.env.PORT) : Number(process.env.PORT) + Math.ceil(Math.random() * 1000);
    let server = http.createServer(app);
    const namespacesIO = createNamespaceIO(server, {db});
    const pubsub = createPubSub(namespacesIO);
    const syncBlockchainData = () => {

        request.get({url: `${process.env.APP_URI}api/chain/overview`})
            .on("response", (res) => {
                console.log(res)
            })
            .on("error", (err) =>{
                console.log(err)
            });
        // request({url: `${process.env.APP_URI}api/all-blocks`}, (error, response, body) => {
        //     if (!error && response.statusCode === 200) {
        //         console.log('update latest chain info', JSON.parse(body));
        //
        //     }
        // });
        // request({url: `${process.env.APP_URI}api/transactions/pending/all`}, (error, response, body) => {
        //     if (!error && response.statusCode === 200) {
        //         console.log('update latest pool info', JSON.parse(body));
        //
        //     }
        // });
    };
    app.use("/", routerConfig(db, namespacesIO));
    app.use(require("./utils/error/error-handlers"));

    server.listen(Port, () => {
        if (process.env.IS_DEFAULT !== "true") {
            syncBlockchainData();
        }
        console.log(`Server running on port: ${Port}`)
    });
}).catch(err => {
    console.error("Unable to connect to db:", err);
});

