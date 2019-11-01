const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {checkReceiverAddress, createPendingTransaction, updateWallet} = require("../db/controller/wallet");
const {getPendingTransaction} = require("../db/controller/pool");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {isValidTransaction} = require("../utils/transaction-utils");
const {createTransaction} = require("../db/model/transaction");
const {ApplicationError} = require("../utils/error/error-types");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});
const {calculatePendingSpent} = require("../utils/crypto-utils");

module.exports = (db, namespacesIO, pubsub) => {
    router.post("/exchange/check-address", authMiddleware, (req, res, next) => {
        return checkReceiverAddress({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/exchange/create-transaction", authMiddleware, (req, res, next) => {
        let pendingTransaction = createTransaction({...req.body}).getData();
        if(isValidTransaction(pendingTransaction)){

            return createPendingTransaction(pendingTransaction).then((data) => {
                updateWallet(data.input.address, {pendingSpent: calculatePendingSpent(data, data.input.address)}).then((wallet) => {

                    namespacesIO.poolTracker.to(req.query.socketID).emit("update-wallet", wallet)
                    namespacesIO.poolTracker.emit("transaction-update", data.hash);

                } );

                getPendingTransaction({skip: 0, take: 5}).then((data) => namespacesIO.poolTracker.emit("new-pool", data));
                getPendingTransaction({skip: 0, take: 5}).then((data) => namespacesIO.poolTracker.emit("new-pool-overview", data));
                getPendingTransaction({}, true).then((data) => {
                    pubsub.broadcast({
                        channel: "TRANSACTION",
                        data
                    })
                });
                return res.status(200).json(data);
            }).catch(err => next(err));
        }
        next(new ApplicationError("invalid_transaction"));


    });
    return router;
};