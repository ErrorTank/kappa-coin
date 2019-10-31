const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {regularLogin, getAuthUserInfo, getDetailUserInfo, checkEmailExisted, updateUserInfo, getUserWallet, signup} = require("../db/controller/user");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.post("/login", (req, res, next) => {
        return regularLogin({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/auth", authMiddleware ,(req, res, next) => {
        return getAuthUserInfo(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/user/:userID/detail", authMiddleware ,(req, res, next) => {
        return getDetailUserInfo(req.params.userID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/user/:userID/wallet", authMiddleware ,(req, res, next) => {
        return getUserWallet(req.params.userID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/user/:userID/check-email/:email", authMiddleware ,(req, res, next) => {
        return checkEmailExisted(req.params).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/user/:userID/update", authMiddleware ,(req, res, next) => {
        return updateUserInfo({userID: req.params.userID, data: req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/sign-up", (req, res, next) => {
        return signup({...req.body}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};