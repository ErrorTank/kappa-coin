const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {checkReceiverAddress, createPendingTransaction} = require("../db/controller/wallet");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.post("/exchange/check-address", authMiddleware, (req, res, next) => {
        return checkReceiverAddress({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/exchange/create-transaction", authMiddleware, (req, res, next) => {
        return createPendingTransaction({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};