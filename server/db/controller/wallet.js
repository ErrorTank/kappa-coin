const User = require("../model/user");
const Wallet = require("../model/wallet");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");

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


module.exports = {
    checkReceiverAddress,

}