const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");
const {ec} = require("../../utils/crypto-utils");

const poolSchema = new Schema({
    updatedAt: {type: Date, default: Date.now()},
    createdAt: {type: Date, default: Date.now()},
    transactions: {
        type: [TransactionModel],
        default: []
    }


});



const Pool = mongoose.model("Pool", poolSchema);

module.exports = Pool;