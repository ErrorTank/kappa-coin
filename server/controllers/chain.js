const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {authorization, createAuthToken} = require("../authorization/auth");
const {getBlockchainOverview, addNewBlock, getRecentBlock} = require("../db/controller/chain");
const {removeTxns} = require("../db/controller/pool");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {createBlock} = require("../db/model/block");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = (db, namespacesIO) => {
    router.get("/chain/overview", (req, res, next) => {
        return getBlockchainOverview().then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });

    router.post("/chain/new-block", authMiddleware ,(req, res, next) => {
        let {txns, nonce, counter, minedBy, difficulty} = req.body;
        const previousBlock = getRecentBlock();
        const newBlock = createBlock({
            previousHash: previousBlock.hash,
            data: txns,
            nonce,
            minedRate: (Number(counter) * 1000).toString(),
            isGenesis: false,
            difficulty,
            minedBy: mongoose.Types.ObjectId(minedBy),
            blockNo: previousBlock.blockNo + 1
        }).getData();
        return Promise.all([addNewBlock(newBlock), removeTxns(txns.map(each => each.hash))]).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });
    return router;
};