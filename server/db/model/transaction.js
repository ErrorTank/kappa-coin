const {hash, sign} = require("../../utils/crypto-utils");

const createTransaction = (data) => {
    let {senderWallet, receiverWallet, amount, status = 'pending'} = data;
    let timestamp = Date.now();
    let hash = hash(timestamp + amount + senderWallet.address + receiverWallet.address);
    let signature = sign(senderWallet.keyPair.privateKey, hash);
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
            status
        })
    }
};



module.exports = {
    TransactionModel: {
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
        }
    },
    createTransaction
};