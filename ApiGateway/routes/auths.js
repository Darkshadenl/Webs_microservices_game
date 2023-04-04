const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const authService    =  process.env.AUTHURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(authService);

router.post('/register', messageSender(circuitBreaker,'post','register'));
router.post('/login',messageSender(circuitBreaker,'post','login'));
router.get('/test', messageSender(circuitBreaker, 'get','test'));
router.get('/welcome', passport.authenticate('jwt', { session: false }), messageSender(circuitBreaker,'get','welcome'));



module.exports = router
