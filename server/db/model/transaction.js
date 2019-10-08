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
    }
});


transactionSchema.pre("save", function (next) {
    let keyPair = ec.genKeyPair();

    this.keyPair.publicKey = keyPair.getPublic().encode("hex");
    this.keyPair.privateKey = keyPair.getPrivate("hex");
    this.address = keyPair.getPublic().encode("hex");
    next();
});

const Wallet = mongoose.model("Wallet", transactionSchema);

module.exports = Wallet;