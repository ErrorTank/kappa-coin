const {cryptoHash, sign} = require("../../utils/crypto-utils");

const createTransaction = (data) => {
    let {senderWallet, receiverWallet, amount, status = 'pending', description = ""} = data;
    let timestamp = Date.now();
    let hash = cryptoHash(timestamp + description + senderWallet.address);
    let signature = sign(senderWallet.keyPair.privateKey, hash);
    let updatedAt = Date.now();
    let createdAt = Date.now();
    return {
        getData: () => ({
            input: {
                timestamp,
                amount: senderWallet.balance,
                address: senderWallet.address,
                signature
            },
            outputMap: {
                [receiverWallet.address]: amount,
                [senderWallet.address]: senderWallet.balance - amount
            },
            hash,
            status,
            description,
            updatedAt,
            createdAt
        })
    }
};



module.exports = {
    TransactionModel: {
        updatedAt: {type: Date, default: Date.now()},
        createdAt: {type: Date, default: Date.now()},
        input: {
            timestamp: {
                type: Date,
                default: Date.now()
            },
            amount: Number,
            address: String,
            signature: String
        },
        outputMap: {
            type: Object
        },
        hash: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["pending", "proceed"],
            default: "pending"
        },
        description: String
    },
    createTransaction
};