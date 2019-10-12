const express = require('express');
const router = express.Router();
const {getPendingTransaction,} = require("../db/controller/pool");


module.exports = () => {
    router.get("/transactions/pending",  (req, res, next) => {
        return getPendingTransaction({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};