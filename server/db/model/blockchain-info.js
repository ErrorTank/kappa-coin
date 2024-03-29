const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {BlockModel} = require("./block");

const blockchainSchema = new Schema({
    difficulty: Number,
    name: String,
    reward: Number
});




module.exports = userDb => userDb.model("Blockchain", blockchainSchema);