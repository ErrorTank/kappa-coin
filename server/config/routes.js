const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.use('/api', require("../controllers/user")(db));
  router.use('/api', require("../controllers/exchange")(db));
  return router;
};