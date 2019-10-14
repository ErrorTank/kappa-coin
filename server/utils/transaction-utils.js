const {cryptoHash, verifySignature} = require("./crypto-utils");

const isValidTransaction = (transaction) => {
    let {input, description, hash} = transaction;
    let {signature, address, timestamp} = input;
    console.log(hash)
    console.log(cryptoHash(new Date(timestamp).getTime() + description + address))
    console.log(verifySignature(address, signature, hash))
    return cryptoHash(new Date(timestamp).getTime() + description + address) === hash && verifySignature(address, signature, hash)
};

module.exports = {
    isValidTransaction
};