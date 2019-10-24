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
const {updateBlockchainDetail, replaceChain} = require("./db/controller/chain");
const {replacePool} = require("./db/controller/pool");

init().then(db => {

    const Port = process.env.IS_DEFAULT === "true" ? Number(process.env.PORT) : Number(process.env.PORT) + Math.ceil(Math.random() * 1000);
    let server = http.createServer(app);
    const namespacesIO = createNamespaceIO(server, {db});
    const pubsub = createPubSub(namespacesIO);
    const syncBlockchainData = () => {
        request.get({url: `${process.env.APP_URI}api/chain/overview`}, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let info = JSON.parse(body);
                console.log('update latest blockchain info');
                updateBlockchainDetail({_id: info._id, difficulty: info.difficulty, name: info.name, reward: info.reward})
            }
        });


        request.get({url: `${process.env.APP_URI}api/all-blocks`}, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let info = JSON.parse(body);
                console.log('update latest chain info');
                replaceChain(info);
            }
        });
        request.get({url: `${process.env.APP_URI}api/transactions/pending/all`}, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let info = JSON.parse(body);
                console.log('update latest pool info');
                replacePool(info)
            }
        });
    };
    app.use("/", routerConfig(db, namespacesIO, pubsub));
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

