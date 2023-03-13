const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const authService    =  process.env.AUTHURL || 'http://localhost:3000/'

//passport
{
const JwtStrategy = require('passport-jwt').Strategy;
const jwtOptions = require('../../config/passportStrategy').options

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    // Check if JWT contains user uid
    console.log("payload = " + jwt_payload)
    if (jwt_payload.id !== undefined) {
        console.log("jwt defined")

        return done(null, jwt_payload);
    }
    console.log("jwt undefined")
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
router.post('/login',requestHandler.send('post','login'));
router.get('/test',requestHandler.send('get','test'));
router.get('/welcome', passport.authenticate('jwt', { session: false }), requestHandler.send('get','welcome'));



module.exports = router
