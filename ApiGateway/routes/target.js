const express = require('express');
const router = new express.Router();
const targetService    =  process.env.TARGETURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')


const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(targetService);

router.get('/test', messageSender(circuitBreaker, 'get', 'test'));



module.exports = router
