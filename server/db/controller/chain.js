const BlockchainSchema = require("../model/blockchain-info");
const Chain = require("../model/chain");
const Wallet = require("../model/wallet");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {isChainValid} = require("../../utils/chain-utils");

const getBlockchainOverview = () => {
    return Promise.all([BlockchainSchema.findById(process.env.BLOCKCHAIN_ID).lean(), getRecentBlock()]).then(([data, latestBlock]) => {
        return {
            ...data,
            latestBlock
        }
    });
};

const validateChain = () => {
    return Chain.find({}).then(isChainValid)
};
// validateChain()

const addNewBlock = (blockData) => {
    return validateChain()
        .then(result => {
            if (!result) {
                return Promise.reject(new ApplicationError("invalid_chain"));
            }
            return;
        })
        .then(() => {
            let blockInstance = new Chain({...blockData});
            return blockInstance.save().then((data) => data.toObject())
        })
};

const getRecentBlock = () => {
    return Chain.find({}).sort({_id: -1}).limit(1).then(data => data[0])
};

const calculateAssociateWalletsBalance = async (txns) => {
    let associates = {};
    for (let txn of txns) {
        let {address} = txn.input;

        let receiverAddresses = Object.keys(txn.outputMap).filter((add => add !== address));
        let senderLost = 0 - receiverAddresses.reduce((total, cur) => total + Number(txn.outputMap[cur]), 0);

        let tasks = [
            Wallet.findOneAndUpdate({address}, {$inc: {balance: senderLost}, $set: {pendingSpent: 0}}, {new: true}).lean(),
            ...receiverAddresses.map(add => {
                let receiveAmount = txn.outputMap[add];

                return Wallet.findOneAndUpdate({address: add}, {$inc: {balance: Number(receiveAmount)}}, {new: true}).lean()
            })
        ];

        let records = await Promise.all(tasks);
        for (let record of records) {
            associates[record.address] = true;
        }

    }
    return Object.keys(associates);
};

const adjustDifficulty = (prevTimestamp, newTimestamp, currentDifficulty) => {
    console.log((new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()))
    if (Number(currentDifficulty) < 2) {
        return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$set: {difficulty: 2}}, {new: true}).lean()
    }
    if ((new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()) > Number(process.env.MINE_RATE)) {
        return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$inc: {difficulty: -1}}, {new: true}).lean()
    }
    return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$inc: {difficulty: 1}}, {new: true}).lean()
};

const adjustDifficulty2 = (prevTimestamp, newTimestamp, currentDifficulty) => {
    console.log((new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()))
    if (Number(currentDifficulty) < 2) {

        return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$set: {difficulty: 2}}, {new: true})
    }
    if ((new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()) > Number(process.env.MINE_RATE)) {

        return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$inc: {difficulty: -1}}, {new: true})
    }

    return BlockchainSchema.findOneAndUpdate({_id: ObjectId(process.env.BLOCKCHAIN_ID)}, {$inc: {difficulty: 1}}, {new: true})
};

const rewardMiner = (minderID) => {
  return  Wallet.findOneAndUpdate({owner: ObjectId(minderID)}, {$inc: {balance: Number(process.env.REWARD)}}, {new: true}).lean();
};

const getBlocks = ({skip, take, keyword, sortKey, sortValue}) => {
    let querySteps = [];

    if (keyword) {
        querySteps.push({
            $match: {
                $or: [
                    {"hash": keyword},
                    {"rootHash": keyword},

                ]
            }
        })
    }
    querySteps = querySteps.concat([
        {
            $lookup: {
                from: "users",
                localField: "minedBy",
                foreignField: "_id",
                as: "minedBy"
            }
        },
        {
            $addFields: {
                "minedBy": {
                    $arrayElemAt: ["$minedBy", 0]
                }
            }
        },
        {$sort: {"timestamp": -1}}, {
            $facet: {
                list: [{$skip: Number(skip)}, {$limit: Number(take)}],
                count: [{$count: 'total'}]
            }
        }
    ]);

    return Chain.aggregate(querySteps).then(data => {

        return {
            list: data[0].list,
            total: data[0].list.length ? data[0].count[0].total : 0
        }
    })

};

module.exports = {
    adjustDifficulty,
    getBlockchainOverview,
    addNewBlock,
    getRecentBlock,
    calculateAssociateWalletsBalance,
    adjustDifficulty2,
    rewardMiner,
    getBlocks
};