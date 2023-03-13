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

router.post('/get-user-id', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json(req.user);
});


router.get('/welcome',(req, res) => {
    res.send('Welcome');
} )
router.get('/test',(req, res) => {
    res.send('test');
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
            const checkPassword = await bcrypt.compare(req.body.password, user.hash)

            if(checkPassword){
                console.log("user logging in")
                const token = jwt.sign({
                    uid: user._id,
                }, process.env.JWT_SECRET);

                // Remove hash and salt from user object
                user.hash = undefined;
                user.salt = undefined;
                // Send user with token
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


function createToken (user) {
    return jwt.sign({
        uid: user.uid,
    }, process.env.JWT_SECRET);
}

module.exports = router;
