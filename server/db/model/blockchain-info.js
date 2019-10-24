const mongoose = require("mongoose");
const {userDb} = require("../../config/db");
const db = userDb();
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {BlockModel} = require("./block");

const blockchainSchema = new Schema({
    difficulty: Number,
    name: String,
    reward: Number
});



const Blockchain = db.model("Blockchain", blockchainSchema);

module.exports = Blockchain;