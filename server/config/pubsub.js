const redis = require('redis');
const {replaceChain, getBlocks, updateBlockchainDetail} = require("../db/controller/chain");
const {replacePool, getPendingTransaction} = require("../db/controller/pool");
const {createPendingTransaction, } = require("../db/controller/wallet");
const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
    BLOCK_FOUND: "BLOCK_FOUND",
    MY_TRANSACTIONS: "MY_TRANSACTIONS",
    MY_WALLET: "MY_WALLET",
    BLOCKCHAIN_INFO: "BLOCKCHAIN_INFO"
};

const createPubSub = (namespacesIO) => {
    const publisher = redis.createClient(process.env.REDIS_URL);
    const subscriber = redis.createClient(process.env.REDIS_URL);
    const handleMessage = (channel, message) => {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                replaceChain(parsedMessage).then(() => getBlocks({skip: 0, take: 50}).then((data) => namespacesIO.chainTracker.emit("new-chain", data)));
                break;
            case CHANNELS.BLOCKCHAIN_INFO:
                updateBlockchainDetail({_id: parsedMessage._id, difficulty: parsedMessage.difficulty, name: parsedMessage.name, reward: parsedMessage.reward}).then(() => namespacesIO.chainTracker.emit("new-chain-info", parsedMessage));
                break;
            case CHANNELS.MY_WALLET:
                namespacesIO.poolTracker.emit("update-wallet-individuals", parsedMessage);
                break;
            case CHANNELS.TRANSACTION:
                replacePool(parsedMessage).then(() => getPendingTransaction({skip: 0, take: 50}).then((data) => namespacesIO.poolTracker.emit("new-pool", data)));
                break;
            case CHANNELS.MY_TRANSACTIONS:
                namespacesIO.poolTracker.emit("new-my-transactions", {
                    txnsInputAddress: parsedMessage,
                });
                break;

            case CHANNELS.BLOCK_FOUND:
                namespacesIO.chainTracker.emit("new-block-found", parsedMessage);
                break;
            default:
                return;
        }
    };
    subscriber.on(
        'message',
        (channel, message) => handleMessage(channel, message)
    );
    Object.values(CHANNELS).forEach(channel => {
        subscriber.subscribe(channel);
    });
    const publish = ({ channel, message }) => {

        subscriber.unsubscribe(channel, () => {

            publisher.publish(channel, message, () => {
                subscriber.subscribe(channel);
            });
        });
    };

    return {
        broadcast({data, channel}){
            console.log("lz me")
            publish({
                channel,
                message: JSON.stringify(data)
            });
        }

    }
};

module.exports = createPubSub;