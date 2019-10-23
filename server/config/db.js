const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {createBlock} = require("../db/model/block")

const configs = [
    {
        url: process.env.DB_HOST + "ecommerce",
        load: () => {

            let User = require("../db/model/user");
            let Wallet = require("../db/model/wallet");
            // new User({
            //     email: "cc@gmail.com",
            //     fullname: "Kappa Clone 3",
            //     password: "123123qwe",
            //     createdAt: Date.now(),
            //     updatedAt: Date.now()
            // }).save();
            // new Wallet({
            //
            //     balance: 100,
            //     owner: "5d9edb84a9a8332b18b1fa20",
            //
            // }).save();
            console.log('\x1b[36m%s\x1b[32m', "Load all central instances successfully!");
        }
    }, {
        url: process.env.IS_DEFAULT ? process.env.LOCAL_HOST + "user1" : process.env.LOCAL_HOST + "user2",
        load: () => {

            let Chain = require("../db/model/chain");
            let Blockchain = require("../db/model/blockchain-info");
            require("../db/model/pool");

            //
            // let genesisBlock = createBlock({
            //
            // });
            // new Chain(genesisBlock.getData()).save();
            // new Blockchain({
            //     difficulty: process.env.INIT_DIFFICULTY,
            //     name: process.env.BLOCKCHAIN_NAME,
            //     reward: process.env.REWARD
            // }).save();


            console.log('\x1b[36m%s\x1b[32m', "Load all decentral instances successfully!");
        }
    },
];


const initDb = () => {
    let status = [];

    for (let dbConfig of configs) {
        status.push(mongoose.connect(dbConfig.url, {useNewUrlParser: true, useCreateIndex: true})
            .then(() => {
                dbConfig.load();
                console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", dbConfig.url);
                return Promise.resolve();
            }).catch(err => {
                    console.log("Cannot connect to mongoDB: \n" + dbConfig.url, err);
                    return Promise.reject();
                }
            ))
    }
    return Promise.all(status)

};

module.exports = {initDb};