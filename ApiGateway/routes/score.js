const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const {Strategy: JwtStrategy} = require("passport-jwt");
const {options: jwtOptions} = require("../../config/passportStrategy");
const scoreService    =  process.env.SCOREURL || 'http://localhost:3000/'


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

console.log(scoreService)
const circuitBreaker = require('../helpers/circuitBreaker')
    .createNewCircuitBreaker(scoreService);


function send(method, path) {
    return (req, res, next) => {
        circuitBreaker.fire(method, path || req.url, req.body, req.user)
            .then(  response => {
                res.status(response.status).json(response.data)
            })
            .catch(error => {
                res.send(error)
                if (error.response) {
                    res.status(error.response.status).send(error);
                }
            });
    }
}

router.get('/test', send('get','test'));
router.get('/', send('get',''));



module.exports = router
