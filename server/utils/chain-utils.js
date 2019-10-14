const {calculateBlockHash, calculateMerkelRoot} = require("./crypto-utils");
const {isValidTransaction} = require("./transaction-utils");

const isBlockValid = block => {
    let {timestamp, isGenesis, previousHash, reward, nonce, difficulty, data, hash, rootHash} = block;
    const isValidBasicBlock = hash === calculateBlockHash({data,timestamp: new Date(timestamp).getTime(), difficulty, nonce});

    if(isGenesis === true){
        return nonce === 0 && data.length === 0 && previousHash === "" && rootHash === null && reward === Number(process.env.REWARD) && isValidBasicBlock;
    }
    return isValidBasicBlock && data.filter(isValidTransaction).length === data.length && calculateMerkelRoot(data.map(each => each.hash)) === rootHash;

};

const isChainValid = blocks => {
    if(blocks.length === 1){
        return isBlockValid(blocks[0]);
    }
    for(let i = 1; i < blocks.length; i++){
        const block = blocks[i];
        const previousBlock = blocks[i - 1];
        if(!isBlockValid(block)){
            return false;
        }
        if(block.previousHash !== previousBlock.hash){
            return false;
        }

    }
    return true;
};

module.exports = {
    isBlockValid,
    isChainValid
};