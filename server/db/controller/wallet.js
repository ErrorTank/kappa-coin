const User = require("../model/user");
const Wallet = require("../model/wallet");
const Chain = require("../model/chain");
const Pool = require("../model/pool");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const sortBy = require("lodash/sortBy");
const reverse = require("lodash/reverse");
const pick = require("lodash/pick");
const {createTransaction} = require("../model/transaction");
const {calculatePendingTransaction} = require("../../utils/crypto-utils");


const checkReceiverAddress = ({sender, address}) => {

    return Wallet.findOne({address}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("Wallet not existed!"))
            }


            if (data.owner.toString() === sender)
                return Promise.reject(new ApplicationError("You cannot send currencies to yourself!"));
            return User.findById(data.owner).lean().then(data => pick(data, ["_id", "fullname", "email"]));

        })

};

const updateWallet = (address, update) => {
    return Wallet.findOneAndUpdate({address}, {...update}, {new: true}).lean()
}


const createPendingTransaction = (payload) => {
    let pendingTransaction = createTransaction(payload).getData();
    return Pool.findOne({"input.address": pendingTransaction.input.address}).lean()
        .then(data => {
            if (data) {
                let actualTransaction = calculatePendingTransaction(data, pendingTransaction, pendingTransaction.input.address);
                return actualTransaction ? Pool.findOneAndUpdate({_id: ObjectId(data._id)}, {
                    ...actualTransaction,
                    updatedAt: Date.now()
                }, {new: true}).lean() : Promise.reject(new ApplicationError("refuse_transaction", {hash: data.hash}))
            }
            let poolInstance = new Pool(pendingTransaction);
            return poolInstance.save().then(data => {
                console.log(data);
                return data;


            });
        });


};

const getUserTransactions = (walletID, {skip, take, keyword, sortKey, sortValue}) => {
    let querySteps = [];
    let querySteps2 = [];
    querySteps.push({
        $match: {
            "input.address": walletID,
        }
    });
    querySteps2.push({
        $match: {
            "data.input.address": walletID
        }
    });
    if (keyword) {
        let kwSearchOutput = `outputMap.${keyword}`;
        let kwSearchOutput2 = `data.outputMap.${keyword}`;
        querySteps.push({
            $match: {

                $or: [
                    {"hash": keyword},
                    {
                        [kwSearchOutput]: {
                            $exists: true
                        }
                    }
                ]
            }
        });
        querySteps2.push({

            $match: {

                $or: [
                    {"data.hash": keyword},
                    {
                        [kwSearchOutput2]: {
                            $exists: true
                        }
                    }
                ]
            }
        })
    }
    querySteps = querySteps.concat([
        {
            $facet: {
                list: [{$skip: Number(skip)}, {$limit: Number(take)}],
                count: [{$count: 'total'}]
            }
        }
    ]);

    querySteps2 = querySteps2.concat([
        {
            $project: {
                data: true,
                _id: true
            }
        },
        {
            $unwind: "$data"
        },
        {
            $facet: {
                list: [{$skip: Number(skip)}, {$limit: Number(take)}],
                count: [{$count: 'total'}]
            }
        }
    ]);

    return Promise.all([
        Pool.aggregate(querySteps),
        Chain.aggregate(querySteps2)
    ]).then(([data1, data2]) => {

        let returnedList = data1[0].list;
        let returnedTotal = data1[0].list.length ? data1[0].count[0].total : 0;
        returnedList = returnedList.concat(data2[0].list.map((each) => each.data));
        returnedTotal = returnedTotal + data2[0].list.length ? data2[0].count[0].total : 0;
        return {
            list: reverse(sortBy(returnedList, each => new Date(each.updatedAt).getTime())),
            total: returnedTotal
        }
    })

};

module.exports = {
    checkReceiverAddress,
    createPendingTransaction,
    updateWallet,
    getUserTransactions
};