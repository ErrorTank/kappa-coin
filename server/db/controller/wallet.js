const User = require("../model/user");
const Wallet = require("../model/wallet");
const Pool = require("../model/pool");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
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
    return Wallet.findOneAndUpdate({address}, {...update},{new: true}).lean()
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

module.exports = {
    checkReceiverAddress,
    createPendingTransaction,
    updateWallet
};