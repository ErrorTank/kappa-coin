const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {authorization, createAuthToken} = require("../authorization/auth");
const {getBlockchainOverview, addNewBlock, getRecentBlock, calculateAssociateWalletsBalance, adjustDifficulty, rewardMiner, getBlocks} = require("../db/controller/chain");
const {removeTxns, getPendingTransaction} = require("../db/controller/pool");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {createBlock} = require("../db/model/block");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = (db, namespacesIO) => {
    router.get("/chain/overview", (req, res, next) => {
        return getBlockchainOverview().then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });
    router.get("/blocks", (req, res, next) => {
        return getBlocks({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });
    router.post("/chain/new-block", authMiddleware ,async (req, res, next) => {
        let {txns, nonce, counter, minedBy, difficulty} = req.body;
        const previousBlock = await getRecentBlock();
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

        // [addNewBlock(newBlock), removeTxns(txns.map(each => each.hash))]
        return addNewBlock(newBlock)
            .then(block => {
                return removeTxns(txns.map(each => each.hash))
                    .then(() => ({block}))
            })
            //04ee: 100; 0400: 100; 045c: 100
            //04ee 10 -> 0400
            //04ee 20 -> 045c
            //0400 10 -> 04ee
            //0400 20 -> 045c
            //04ee: 80; 0400: 80; 045c: 140

            .then(({block}) => {
                let {data} = block;
                return calculateAssociateWalletsBalance(data).then(associates => {
                    //todo real time update wallet

                    return {block, associates};
                })
            })
            .then(data => {

                return adjustDifficulty(previousBlock.timestamp, newBlock.timestamp, newBlock.difficulty).then((blockchain) => ({...data, blockchain}))
            })
            .then((data) => {
                return rewardMiner(minedBy).then((wallet) => {
                    namespacesIO.poolTracker.to(req.query.socketID).emit("update-wallet", wallet);
                    namespacesIO.poolTracker.emit("update-wallet-individuals", data.associates);
                    getPendingTransaction({skip: 0, take: 5}).then((data) => namespacesIO.poolTracker.emit("new-pool", data));
                    getBlocks({skip: 0, take: 5}).then((data) => namespacesIO.chainTracker.emit("new-chain", data));
                    return data;
                })
            })
            .then((data) => {
                namespacesIO.chainTracker.emit("new-chain-info", {
                    ...data.blockchain,
                    latestBlock: {...data.block}
                });
                // namespacesIO.chainTracker.emit("new-chain-info", {
                //     ...data.blockchain,
                //     latestBlock: {...data.block}
                // });
                return res.status(200).json(data.block);
        }).catch(err => next(err));
    });
    return router;
};