const BlockchainSchema = require("../model/blockchain-info");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");

const getBlockchainOverview = () => {
    return BlockchainSchema.findById(process.env.BLOCKCHAIN_ID).lean();
};


module.exports = {

    getBlockchainOverview
};