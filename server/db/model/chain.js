const mongoose = require("mongoose");
const {userDb} = require("../../config/db");
const db = userDb();

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {BlockModel} = require("./block");

const chainSchema = new Schema(BlockModel);



const Chain = db.model("Chain", chainSchema);

module.exports = Chain;