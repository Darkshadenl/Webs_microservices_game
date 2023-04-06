const express = require('express');
const router = new express.Router();
const passport = require('passport');
const targetService    =  process.env.TARGETURL || 'http://localhost:3000/'
const {send: messageSender} = require('../helpers/messageSender')

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const { createNewCircuitBreaker } = require('../helpers/circuitBreaker')

const circuitBreaker = createNewCircuitBreaker(targetService);


router.get('/test', messageSender(circuitBreaker, 'get'));
router.get('/all', messageSender(circuitBreaker, 'get', 'target'));
router.get('/:id', messageSender(circuitBreaker, 'get', 'target'));
router.get('/', messageSender(circuitBreaker, 'get', 'target'));
router.delete('/:id', messageSender(circuitBreaker, 'delete', 'target'));
router.post('', messageSender(circuitBreaker,'post','target'))


module.exports = router
