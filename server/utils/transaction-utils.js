const {cryptoHash, verifySignature} = require("./crypto-utils");

const isValidTransaction = (transaction) => {
    let {input, description, hash} = transaction;
    let {signature, address, timestamp} = input;
    return cryptoHash(timestamp + description + address) === hash && verifySignature(address, signature, hash)
};

module.exports = {
    isValidTransaction
};