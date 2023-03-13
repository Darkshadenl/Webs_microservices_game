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
    const salt = bcrypt.genSaltSync();



    const user = new User({
        email: body.email,
        hash: bcrypt.hashSync(body.password, salt),
        salt: salt,
        isOwner: body.isOwner,
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
            console.log("user pw" + user.hash)
            console.log("req pw" + req.body.password)
            console.log("user found")
            const checkPassword = await bcrypt.compare(req.body.password, user.hash)
            console.log("pw found")

            if(checkPassword){
                res.status(201).json({token: createToken(user)});
                return;
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


function createToken (user) {
    //TODO replace with secret key from .env
    console.log(process.env.JWT_SECRET)
    return jwt.sign({
        uid: user.uid,
    }, 'secret');
}

module.exports = router;
