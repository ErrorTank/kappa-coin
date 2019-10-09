const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {ec} = require("../../utils/crypto-utils");

const transactionSchema = new Schema({
    updatedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    input: {
        timestamp: {
            type: Date,
            default: Date.now()
        },
        amount: Number,
        address: String,
        signature: String
    },
    outputMap:{
        type: Object
    }
});



const Wallet = mongoose.model("Transaction", transactionSchema);

module.exports = Wallet;