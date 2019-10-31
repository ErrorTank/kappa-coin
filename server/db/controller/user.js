const User = require("../model/user")(require("../../config/db").appDb);
const Wallet = require("../model/wallet")(require("../../config/db").appDb);
const Chain = require("../model/chain")(require("../../config/db").userDb);
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
            Promise.all([createAuthToken(pick(data, ["_id", "email", "fullname"]), getPrivateKey(), {
                expiresIn: "30d",
                algorithm: "RS256"
            }), Wallet.findOne({owner: data._id})])
                .then(([token, wallet]) => ({
                    token,
                    user: omit(data, ["password"]),
                    wallet
                }))
                .catch(err => Promise.reject(err))
        )
        .catch(err => {

            return Promise.reject(err)
        })
};
const getAuthUserInfo = userID => {

    return User.findOne({_id: mongoose.Types.ObjectId(userID)}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("not_existed"))
            }
            if (data.password !== data.password)
                return Promise.reject(new ApplicationError("password_wrong"));
            return data;

        })
        .then(data => {
            return Wallet.findOne({owner: data._id}).then((wallet) => ({
                wallet,
                data
            }))
        })
        .then(({wallet, data}) =>
            ({
                user: omit(data, ["password"]),
                wallet
            })
        )
        .catch(err => {

            return Promise.reject(err)
        })
};

const getDetailUserInfo = (userID) => {
    return Promise.all([
        User.findById(ObjectId(userID)).lean(),
        Wallet.findOne({owner: ObjectId(userID)}).lean(),
        Chain.aggregate([
            {
                $match: {
                    minedBy: ObjectId(userID)
                }
            },
        ]),

    ]).then(([info, wallet, data]) => {

        return Chain.aggregate([
            {
                $match: {
                    "data.input.address": wallet.address
                },

            },

        ]).then((data2) => {

            return {
                info,
                wallet,
                statistic: {
                    minedBlocks: data.length,
                    proceedTransactions: data2.length,
                    profit: data.length * 3
                }
            }
        });

    })
};

const  checkEmailExisted = ({userID, email}) => {
    return User.findOne({_id: { $ne: mongoose.Types.ObjectId(userID) }, email}).lean()
        .then(data => {
            if (data) {
                return Promise.reject()
            }
            return {};

        })

};

const updateUserInfo = ({userID, data}) => {
    return User.findOneAndUpdate({_id: mongoose.Types.ObjectId(userID)}, {$set: {...data, updatedAt: Date.now()}}, {
        new: true
    }).lean().then(data => {
        if (!data) {
            return Promise.reject()
        }
        return data;

    })
};

const getUserWallet = userID => {
    return Wallet.findOne({owner: ObjectId(userID)}).lean();
};

const signup = ({email, password, fullname}) => {
    return User.findOne({email}).lean()
        .then(data => {
            if (data) {
                return Promise.reject(new ApplicationError("existed"))
            }
            const newUser = new User({email, password, fullname, createdAt: Date.now(), updatedAt: Date.now()});
            return newUser.save().then(user => {
                let realUser = user.toObject();
                const newWallet = new Wallet({balance: 100, owner: realUser._id});
                return newWallet.save().then(wallet => ({
                    wallet: wallet.toObject(),
                    user: omit(realUser, "password")
                }))
            }).then(dataObj => {
                return createAuthToken(pick(dataObj.user, ["_id", "email", "fullname"]), getPrivateKey(), {
                    expiresIn: "30d",
                    algorithm: "RS256"
                }).then(token => ({
                    token,
                    ...dataObj
                }))
            })

        })
};

module.exports = {
    regularLogin,
    getAuthUserInfo,
    getDetailUserInfo,
    checkEmailExisted,
    updateUserInfo,
    getUserWallet,
    signup
}