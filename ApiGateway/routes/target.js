const express = require('express');
const router = new express.Router();
const passport = require('passport');
const targetService    =  process.env.TARGETURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(targetService);

router.get('/test', messageSender(circuitBreaker, 'get', 'test'));
router.get('/all', messageSender(circuitBreaker, 'get', 'target'));
router.get('/byUsername/:username', messageSender(circuitBreaker, 'get', 'target'));
router.get('/:id', messageSender(circuitBreaker, 'get', 'target'));
router.get('/', messageSender(circuitBreaker, 'get', 'target'));
router.delete('/:id', messageSender(circuitBreaker, 'delete', 'target'));
router.post('', messageSender(circuitBreaker,'post','target'))


module.exports = router
