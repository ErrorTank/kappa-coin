const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const {TransactionModel} = require("./transaction");
const {calculateBlockHash, calculateMerkelRoot} = require("../../utils/crypto-utils");

const createBlock = (info) => {
    let {previousHash = "", data = [], nonce = 0, minedRate = process.env.MINE_RATE.toString(), isGenesis = true, hash, difficulty = process.env.INIT_DIFFICULTY, reward = process.env.REWARD, minedBy = mongoose.Types.ObjectId(), blockNo = 0} = info;
    let timestamp = Date.now();
    hash = hash || calculateBlockHash({data, nonce, difficulty, timestamp});
    let rootHash = calculateMerkelRoot(data.map((each) => each.hash));
    let createdAt = Date.now()
    return {
        getData: () => ({
            previousHash,
            data: [...data],
            nonce,
            minedRate,
            isGenesis,
            hash,
            reward,
            minedBy,
            timestamp,
            blockNo,
            difficulty,
            rootHash,
            createdAt
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
        rootHash: {
            type: String,
        },
        hash: {
            type: String,

        },
        reward: {
            type: Number,
            default: 0
        },
        blockNo: {
            type: Number,
            default: 0
        },
        minedBy: {
            type: ObjectId,
            ref: "User"
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
        },
        difficulty: {
            type: Number,
            default: process.env.INIT_DIFFICULTY
        }

    },
    createBlock
};