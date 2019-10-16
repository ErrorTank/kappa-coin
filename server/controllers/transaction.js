const express = require('express');
const router = express.Router();
const {getPendingTransaction, getValidTransactions, getTransaction} = require("../db/controller/pool");


module.exports = () => {
    router.get("/transactions/pending",  (req, res, next) => {
        return getPendingTransaction({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/transactions/pending/valid",  (req, res, next) => {
        return getValidTransactions().then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/transaction/:txnID/details",  (req, res, next) => {
        return getTransaction(req.params.txnID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};