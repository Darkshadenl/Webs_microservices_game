const express = require('express');
const router = new express.Router();
const targetService    =  process.env.TARGETURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender').send
const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(targetService);

router.get('/test',    messageSender(circuitBreaker, 'get'));
router.get('/all', messageSender(circuitBreaker, 'get', 'target'));
router.get('/:id', messageSender(circuitBreaker, 'get', 'target'));
router.get('/', messageSender(circuitBreaker, 'get', 'target'));
router.delete('/:id', messageSender(circuitBreaker, 'delete', 'target'));
router.post('', messageSender(circuitBreaker,'post','target'))


module.exports = router
