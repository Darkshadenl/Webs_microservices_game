// Import express
const express = require('express');
const router = new express.Router();

// Import passport
const passport = require('passport');
const strategy = require('passport-jwt').Strategy;


// Passport setup
// passport.use(strategy);
// router.use(passport.initialize());

router.get('/',(req, res) => {
    res.send('Welcome');
} )

module.exports = router;
