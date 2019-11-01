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
    init: () => {
        return Promise.all([
            promise1,
            promise2
        ]).then(() => {
            const User = require("../db/model/user")(appDb);
            const Wallet = require("../db/model/wallet")(appDb);
            // new User({
            //     email: "kappa1@gmail.com",
            //     fullname: "Kappa Clone 1",
            //     password: "123123qwe",
            //     createdAt: Date.now(),
            //     updatedAt: Date.now()
            // }).save().then(data => {
            //     new Wallet({
            //
            //         balance: 100,
            //         owner: data.toObject()._id,
            //
            //     }).save();
            // });
            // new User({
            //     email: "kappa2@gmail.com",
            //     fullname: "Kappa Clone 2",
            //     password: "123123qwe",
            //     createdAt: Date.now(),
            //     updatedAt: Date.now()
            // }).save().then(data => {
            //     new Wallet({
            //
            //         balance: 100,
            //         owner: data.toObject()._id,
            //
            //     }).save();
            // });

            const Chain = require("../db/model/chain")(userDb);
            const Blockchain = require("../db/model/blockchain-info")(userDb);
            require("../db/model/pool")(userDb);


            // let genesisBlock = createBlock({
            //
            // });
            // new Chain(genesisBlock.getData()).save();
            // new Blockchain({
            //     difficulty: process.env.INIT_DIFFICULTY,
            //     name: process.env.BLOCKCHAIN_NAME,
            //     reward: process.env.REWARD,
            //     _id: ObjectId(process.env.BLOCKCHAIN_ID)
            // }).save();
            return null;
        });
    },
    appDb,
    userDb
};

