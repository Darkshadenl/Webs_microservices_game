const {deleteTarget, saveUser, userExists, saveUserTarget} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const {createPayload} = require("../payloadHandling/payloadCreator");
const publisher = require("../rabbitMQ/publisher");
const createError = require("http-errors");
const multer = require('multer')

const upload = multer();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Scoreservice'});
});

module.exports = router;
