const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {

  router.use('/api', require("../controllers/user")(db, namespacesIO));
  router.use('/api', require("../controllers/exchange")(db, namespacesIO));
  router.use('/api', require("../controllers/transaction")(db, namespacesIO));
  router.use('/api', require("../controllers/block")(db, namespacesIO));
  router.use('/api', require("../controllers/chain")(db, namespacesIO));

  return router;
};