const express = require('express');
const router = new express.Router();
const passport = require('passport');
const axios = require('axios');
const {Strategy: JwtStrategy} = require("passport-jwt");
const {options: jwtOptions} = require("../../config/passportStrategy");
const scoreService    =  process.env.SCOREURL || 'http://localhost:3000/'
const messageSender = require('../helpers/messageSender')

const strategy = require('../helpers/PasportStrategy')

passport.use(strategy);
router.use(passport.initialize());

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

router.get('/test', messageSender(circuitBreaker,'get','test'));
router.get('/', messageSender(circuitBreaker,'get',''));



module.exports = router
