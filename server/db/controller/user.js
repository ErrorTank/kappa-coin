const User = require("../model/user");
const Wallet = require("../model/wallet");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");

const regularLogin = ({email, password}) => {

    return User.findOne({email}).lean()
        .then(data => {
            if (!data) {
                console.log(data)
                return Promise.reject(new ApplicationError("not_existed"))
            }
            if (data.password !== password)
                return Promise.reject(new ApplicationError("password_wrong"));
            return data;

        })
        .then((data) =>
            createAuthToken(pick(data, ["_id", "email", "fullname"]), getPrivateKey(), {
                expiresIn: "30d",
                algorithm: "RS256"
            })
                .then(token => ({
                    token,
                    user: omit(data, ["password"])
                }))
                .catch(err => Promise.reject(err))
        )
        .catch(err => {

            return Promise.reject(err)
        })
};
const getUserInfo = userID => {

    return User.findOne({_id: mongoose.Types.ObjectId(userID)}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("not_existed"))
            }
            if (data.password !== data.password)
                return Promise.reject(new ApplicationError("password_wrong"));
            return data;

        })
        .then((data) =>
            omit(data, ["password"])
        )
        .catch(err => {

            return Promise.reject(err)
        })
};

const getDetailUserInfo = (userID) => {
    return Promise.all([
        User.findById(ObjectId(userID)).lean(),
        Wallet.findOne({owner: ObjectId(userID)}).lean(),

    ]).then(([info, wallet]) => {

        return {
            info: omit(info, "password"),
            wallet,
            statistic: {
                minedBlocks: 10,
                proceedTransactions: 10,
                profit: 19.2
            }
        }
    })
};

module.exports = {
    regularLogin,
    getUserInfo,
    getDetailUserInfo
}