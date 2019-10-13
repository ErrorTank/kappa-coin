const express = require('express');
const router = express.Router();
const {getPendingTransaction, getValidTransactions} = require("../db/controller/pool");


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
    return router;
};