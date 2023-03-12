const {deleteMessage, putMessage} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const createPayload = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
