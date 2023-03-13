const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const {Strategy: JwtStrategy} = require("passport-jwt");
const {options: jwtOptions} = require("../../config/passportStrategy");
const authService    =  process.env.AUTHURL || 'http://localhost:3011/'

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(process.env.AUTHURL);

const requestHandler = require('../helpers/request-handler')
    .createNewRequestHandler(circuitBreaker);



router.get('/welcome',requestHandler.send('get','welcome'));


module.exports = router
