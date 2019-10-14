const User = require("../model/user");
const Wallet = require("../model/wallet");
const Pool = require("../model/pool");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {isValidTransaction} = require("../../utils/transaction-utils");

const getPendingTransaction = ({skip, take, keyword, sortKey, sortValue}) => {
    let querySteps = [];

    if (keyword) {
        let kwSearchOutput = `outputMap.${keyword}`;
        querySteps.push({
            $match: {
                $or: [
                    {"hash": keyword},
                    {"input.address": keyword},
                    {
                        [kwSearchOutput]: {
                            $exists: true
                        }
                    }
                ]
            }
        })
    }
    querySteps = querySteps.concat([
        {$sort: {"input.timestamp": -1}}, {
            $facet: {
                list: [{$skip: Number(skip)}, {$limit: Number(take)}],
                count: [{$count: 'total'}]
            }
        }
    ]);

    return Pool.aggregate(querySteps).then(data => {

        return {
            list: data[0].list,
            total: data[0].list.length ? data[0].count[0].total : 0
        }
    })

};

const getValidTransactions = () => {
  return Pool.find().then(data => {
      return data.filter(isValidTransaction)
  })
};

const removeTxns = (txnsHashes) => {
    return Pool.deleteMany({hash: {$in: txnsHashes}})
};

module.exports = {
    getPendingTransaction,
    getValidTransactions,
    removeTxns

};