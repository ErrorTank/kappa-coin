const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const loadDbInstances = () => {



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
    //     address: "e4bc7fd47d2f6e2762b0628b4d7eed7cc5d81e5a0cd1e818c6e846b4383f0d4a",
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