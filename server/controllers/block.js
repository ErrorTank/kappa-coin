const express = require('express');
const router = express.Router();
const {getBlockDetail} = require("../db/controller/chain");



module.exports = (db, namespacesIO) => {
    router.get("/block/:blockID/details", (req, res, next) => {
        return getBlockDetail(req.params.blockID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));
    });
    return router;
};