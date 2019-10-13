const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {checkReceiverAddress, createPendingTransaction, updateWallet} = require("../db/controller/wallet");
const {getPendingTransaction} = require("../db/controller/pool");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});
const {calculatePendingSpent} = require("../utils/crypto-utils");

module.exports = (db, namespacesIO) => {
    router.post("/exchange/check-address", authMiddleware, (req, res, next) => {
        return checkReceiverAddress({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/exchange/create-transaction", authMiddleware, (req, res, next) => {
        return createPendingTransaction({...req.body}).then((data) => {
            updateWallet(data.input.address, {pendingSpent: calculatePendingSpent(data, data.input.address)}).then((wallet) => {
                namespacesIO.poolTracker.to(req.query.socketID).emit("update-wallet", wallet)
            } );
            getPendingTransaction({skip: 0, take: 50}).then((data) => namespacesIO.poolTracker.emit("new-pending-transaction", data));
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};