const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const {Strategy: JwtStrategy} = require("passport-jwt");
const {options: jwtOptions} = require("../../config/passportStrategy");
const targetService    =  process.env.TARGETURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(targetService);

router.get('/test', messageSender(circuitBreaker, 'get', 'test'));



module.exports = router
