const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO, pubsub) => {

  router.use('/api', require("../controllers/user")(db, namespacesIO, pubsub));
  router.use('/api', require("../controllers/exchange")(db, namespacesIO, pubsub));
  router.use('/api', require("../controllers/transaction")(db, namespacesIO, pubsub));
  router.use('/api', require("../controllers/block")(db, namespacesIO, pubsub));
  router.use('/api', require("../controllers/chain")(db, namespacesIO, pubsub));

  return router;
};