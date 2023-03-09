// Startup db connection
const mongoose = require('./Database/mongooseConnection');

// Import express
const express = require('express');
const router = new express.Router();

// Import passport
const passport = require('passport');
const strategy = require('passport-jwt').Strategy;

// Import route specific dependencies
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Passport setup
passport.use(strategy);
router.use(passport.initialize());

router.get('/welcome',(req, res) => {
    res.send('Welcome');
} )

// Setup registration
router.post('/register', (req, res) => {
    console.log('Registering user...');
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);

    console.log("password = ", body.password);
    console.log("hash = ", salt);


    const user = new User({
        // Generate UID
        email: body.email,
        // Hash password
        hash: bcrypt.hashSync(body.password, salt),
        salt: salt,
        isOwner: body.isOwner,
    });

    user.save()
        .then(user => {
            console.log("Registered user");
            res.status(201).json(user);
        })
        .catch(err => {
            console.log("Error registering user", err);
            res.status(400).json({
                error: err
            });
        });
});

module.exports = router;
