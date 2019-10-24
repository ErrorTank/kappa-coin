const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");

const poolSchema = new Schema(TransactionModel);




module.exports = userDb => userDb.model("Pool", poolSchema);