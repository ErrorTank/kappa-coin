const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {createBlock} = require("../db/model/block")

const appDbUrl = process.env.LOCAL_HOST + "app";
let resolve1 = null;
let resolve2 = null;
let promise1 = (() => new Promise((resolve) => {
    resolve1 = resolve;
}))();
let promise2 = (() => new Promise((resolve) => {
    resolve2 = resolve;
}))();
let appDb = mongoose.createConnection(appDbUrl, {useNewUrlParser: true, useCreateIndex: true}, () => {

    console.log('\x1b[36m%s\x1b[32m', "Load all central instances successfully!");
    console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", appDbUrl);
    resolve1();
});


const userDbUrl = process.env.IS_DEFAULT ? process.env.LOCAL_HOST + "user1" : process.env.LOCAL_HOST + "user2";
let userDb =  mongoose.createConnection(userDbUrl, {useNewUrlParser: true, useCreateIndex: true}, () => {


    console.log('\x1b[36m%s\x1b[32m', "Load all decentral instances successfully!");
    console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", userDbUrl);
    resolve2()
});

module.exports = {
    init: () => Promise.all([
        promise1,
        promise2
    ]).then(() => {

        let User = require("../db/model/user");
        let Wallet = require("../db/model/wallet");
        // new User({
        //     email: "kappa@gmail.com",
        //     fullname: "Kappa Clone 2",
        //     password: "123123qwe",
        //     createdAt: Date.now(),
        //     updatedAt: Date.now()
        // }).save();
        // new Wallet({
        //
        //     balance: 100,
        //     owner: "5db10e7341698d1134719a5c",
        //
        // }).save();
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
        //     reward: process.env.REWARD,
        //     _id: ObjectId("5db129b8b0a1450750b108d3")
        // }).save();
        return;
    }),
    appDb: () => appDb,
    userDb: () => userDb
}

