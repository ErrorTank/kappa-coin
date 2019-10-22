const PubNub = require('pubnub');
const uuid = PubNub.generateUUID();


const credentials = {
    publishKey: 'pub-c-8820f465-a190-4fdc-b2b0-92dbe3e17985',
    subscribeKey: 'sub-c-b1e5ec9c-f4a9-11e9-ba7f-428dd4590e3f',
    uuid
};

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

const listeners = (namespacesIO) => {
  return {
      message: messageObject => {
          const { channel, message } = messageObject;

          console.log(`Message received. Channel: ${channel}. Message: ${message}`);
          const parsedMessage = JSON.parse(message);

          switch(channel) {
              case CHANNELS.BLOCKCHAIN:
                  // this.blockchain.replaceChain(parsedMessage, true, () => {
                  //     this.transactionPool.clearBlockchainTransactions(
                  //         { chain: parsedMessage.chain }
                  //     );
                  // });

                  break;
              case CHANNELS.TRANSACTION:
                  // if (!this.transactionPool.existingTransaction({
                  //     inputAddress: this.wallet.publicKey
                  // })) {
                  //     this.transactionPool.setTransaction(parsedMessage);
                  // }
                  break;
              default:
                  return;
          }
      }
  }
};

const createPubSub = (namespacesIO) => {
    const pubnub = new PubNub(credentials);
    pubnub.subcribe({ channels: [Object.values(CHANNELS)] });
    pubnub.addListener(listeners(namespacesIO));
};

module.exports = createPubSub;