const mongoose = require("mongoose");
const {} = require("../../config/db");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {BlockModel} = require("./block");

const chainSchema = new Schema(BlockModel);



module.exports = userDb => userDb.model("Chain", chainSchema);