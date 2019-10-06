const mongoose = require("mongoose");

const loadDbInstances = () => {



    require("../db/model/user");
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