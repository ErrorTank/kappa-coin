const BlockchainSchema = require("../model/blockchain-info");
const Chain = require("../model/chain");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {isChainValid} = require("../../utils/chain-utils");

const getBlockchainOverview = () => {
    return BlockchainSchema.findById(process.env.BLOCKCHAIN_ID).lean();
};

const validateChain = () => {
  return Chain.find({}).then(isChainValid)
};

const addNewBlock = (blockData) => {

};

const getRecentBlock = () => {
    return Chain.find({}).sort({_id: -1}).limit(1)
};

module.exports = {

    getBlockchainOverview,
    addNewBlock,
    getRecentBlock
};