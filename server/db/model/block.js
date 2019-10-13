const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");
const {cryptoHash} = require("../../utils/crypto-utils");

const createBlock = (info) => {
    let {previousHash, data, nonce, minedRate, isGenesis, hash} = info;
    let timestamp = Date.now();
    return {
        getData: () => ({
            previousHash,
            data,
            nonce,
            minedRate,
            isGenesis,
            hash,
            timestamp
        })
    }
};



module.exports = {
    BlockModel: {
        createdAt: {type: Date, default: Date.now()},
        timestamp: {
            type: Date,
            default: Date.now()
        },
        previousHash: {
            type: String,
            default: ""
        },
        hash: {
            type: String,

        },
        nonce: {
          type: Number,
          default: 0
        },
        data: {
            type: [TransactionModel],
            default: []
        },
        minedRate: {
            type: String,
            default: process.env.MINE_RATE.toString()
        },
        isGenesis: {
            type: Boolean,
            default: true
        }

    },
    createBlock
};