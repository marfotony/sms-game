var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res) {
  if (process.env.TWILIO_USER === '' || process.env.TWILIO_PW === '' ||
    process.env.ADMIN_USER === '' || process.env.ADMIN_PW === '' ||
    mongoose.connection.readyState !== 1) {
    res.status(503).send({ "status": "not ok" });

    return;
  }

  res.status(200).send({ "status": "ok" });
});

module.exports = router;