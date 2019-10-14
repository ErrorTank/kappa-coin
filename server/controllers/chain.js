const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getBlockchainOverview} = require("../db/controller/chain");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = (db, namespacesIO) => {
    router.get("/chain/overview", (req, res, next) => {
        return getBlockchainOverview().then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });
    return router;
};