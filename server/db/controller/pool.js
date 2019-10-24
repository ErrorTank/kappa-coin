const Chain = require("../model/chain")(require("../../config/db").userDb);
const Wallet = require("../model/wallet")(require("../../config/db").appDb);
const Pool = require("../model/pool")(require("../../config/db").userDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {isValidTransaction} = require("../../utils/transaction-utils");

const getPendingTransaction = ({skip, take, keyword, sortKey, sortValue}, getAll = false) => {
    if(getAll){
        return Pool.find({}).lean()
    }
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
        {$sort: {"updatedAt": -1}},
        {
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

const getTransaction = txnID => {
    let returnedData = data =>  ({txn: data.data, block: data.hash ?  omit(data, "data") : null});
    return Pool.findOne({hash: txnID}).lean()
        .then(data1 => data1 ? returnedData({data: data1}) : Chain.findOne({"data.hash": txnID}).lean().then((data2) => data2 ? returnedData({...data2, data: data2.data.find(each => each.hash === txnID)}) : null))
};

const replacePool = (pool) => {
    return Pool.deleteMany({}).then(() =>{
        return Pool.insertMany(pool)
    })
};

module.exports = {
    getPendingTransaction,
    getValidTransactions,
    removeTxns,
    getTransaction,
    replacePool

};