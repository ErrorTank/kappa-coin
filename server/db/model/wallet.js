const mongoose = require("mongoose");
const {appDb} = require("../../config/db");
const db = appDb();
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {ec} = require("../../utils/crypto-utils");

const walletSchema = new Schema({
    balance: {
        type: Number,
        required: true,
        default: process.env.STARTING_BALANCE
    },
    keyPair: {
        type: {
            publicKey: String,
            privateKey: String
        },
        default: {}
    },
    address: {
        type: String,
        default: ""
    },
    owner: {
        type: ObjectId,
        ref: "User"
    },
    pendingSpent: {
      type: Number,
      default: 0
    },
    updatedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},

});


walletSchema.pre("save", function (next) {
    let keyPair = ec.genKeyPair();

    this.keyPair.publicKey = keyPair.getPublic().encode("hex");
    this.keyPair.privateKey = keyPair.getPrivate("hex");
    this.address = keyPair.getPublic().encode("hex");
    next();
});

const Wallet = db.model("Wallet", walletSchema);

module.exports = Wallet;