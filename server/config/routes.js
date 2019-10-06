const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.use('/api', require("../controllers/user")(db));
  return router;
};