const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");

const poolSchema = new Schema(TransactionModel);



const Pool = mongoose.model("Pool", poolSchema);

module.exports = Pool;