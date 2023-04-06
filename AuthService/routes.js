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
const roles = require('../config/authorizationRole');

// Passport setup
passport.use(strategy);
router.use(passport.initialize());

router.get('/welcome',(req, res) => {
    res.send('Welcome');
} )
router.get('/admin',passport.authenticate('jwt', { session: false }), roles('admin'),(req, res) => {
    res.send('test');
} )

// Setup registration
router.post('/register', (req, res) => {
    const salt = bcrypt.genSaltSync();

    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role,
        salt: salt,
        isOwner: req.body.isOwner,
    });

    user.save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});


router.post('/login', async function (req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const checkPassword = await bcrypt.compare(req.body.password, user.password)
            if(checkPassword){
                const token = createOpaqueToken(user);
                res.status(201).json({
                    user: user,
                    token: token
                });
                return
            }
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }
        return res.status(401).json({
            error: 'Invalid credentials'
        });

    } catch (error) {
        console.error(error)
        return res.status(401).json({
            error: 'Login failed'
        });
    }
})


function createOpaqueToken (user) {
    return jwt.sign({
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET);
}

module.exports = router;
