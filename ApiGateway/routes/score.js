const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const {Strategy: JwtStrategy} = require("passport-jwt");
const {options: jwtOptions} = require("../../config/passportStrategy");
const scoreService    =  process.env.SCOREURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')
const roles = require('../helpers/authorizationRole');

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(scoreService);


router.get('/test',roles('admin'), messageSender(circuitBreaker,'get','test'));
router.get('/', messageSender(circuitBreaker,'get',''));



module.exports = router
