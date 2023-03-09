const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const authService    =  process.env.AUTHURL

//passport
{
const JwtStrategy = require('passport-jwt').Strategy;
const jwtOptions = require('../../config/passportStrategy').options

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    // Check if JWT contains user uid
    if (jwt_payload.uid !== undefined) {
        return done(null, jwt_payload);
    }
    return done(null, false);
});


passport.use(strategy);
router.use(passport.initialize());
}

const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(process.env.AUTHURL);

const requestHandler = require('../helpers/request-handler')
    .createNewRequestHandler(circuitBreaker);


router.post('/register',requestHandler.send('post','register'));
router.get('/welcome',requestHandler.send('get','welcome'));


module.exports = router
