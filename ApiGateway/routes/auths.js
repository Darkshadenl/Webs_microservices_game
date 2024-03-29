const express = require('express');
const router = new express.Router();
const passport = require('passport');
const authService    =  process.env.AUTHURL || 'http://localhost:3000/'
const {send: messageSender} = require('../helpers/messageSender')
const roles = require('../../config/authorizationRole');



const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const { createNewCircuitBreaker } = require('../helpers/circuitBreaker')

const circuitBreaker = createNewCircuitBreaker(authService);

router.post('/register', messageSender(circuitBreaker,'post',''));
router.post('/login',messageSender(circuitBreaker,'post',''));
router.get('/admin', passport.authenticate('jwt', { session: false }), roles('admin'),  messageSender(circuitBreaker, 'get',''));
router.get('/welcome', passport.authenticate('jwt', { session: false }), messageSender(circuitBreaker,'get',''));



module.exports = router
