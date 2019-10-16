const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {createBlock} = require("../db/model/block")

const loadDbInstances = () => {



    let User = require("../db/model/user");
    let Wallet = require("../db/model/wallet");
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

    console.log('\x1b[36m%s\x1b[32m', "Load all db instances successfully!");

};
const initDb = () => new Promise((resolve, reject) => {
    //init db here

    mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useCreateIndex: true})
        .then(() => {
            console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!");
            loadDbInstances();

            resolve()
        }).catch(err => {
            console.log("Cannot connect to mongoDB: \n", err);
            reject();
        }
    );
});

module.exports = initDb;