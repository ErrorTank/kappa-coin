const redis = require('redis');

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

const createPubSub = (namespacesIO) => {
    const publisher = redis.createClient(process.env.REDIS_URL);
    const subscriber = redis.createClient(process.env.REDIS_URL);
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
            publish({
                channel,
                message: JSON.stringify(data)
            });
        }

    }
};

module.exports = createPubSub;