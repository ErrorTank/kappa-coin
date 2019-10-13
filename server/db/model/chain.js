const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {BlockModel} = require("./block");

const chainSchema = new Schema(BlockModel);



const Chain = mongoose.model("Chain", chainSchema);

module.exports = Chain;