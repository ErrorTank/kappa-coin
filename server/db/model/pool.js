const mongoose = require("mongoose");
const {userDb} = require("../../config/db");
const db = userDb();

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");

const poolSchema = new Schema(TransactionModel);



const Pool = db.model("Pool", poolSchema);


module.exports = Pool;