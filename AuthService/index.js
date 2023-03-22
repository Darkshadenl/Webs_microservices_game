const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const passport = require('passport');
const strategy = require('../config/passportStrategy');

require('dotenv').config();


// app.use(cors());
app.use(express.json());

passport.use(strategy.InternalStrategy);
app.use(passport.initialize());

app.use('/', passport.authenticate('jwt', {session: false}), require('./routes'));

app.listen(port,  () => {
    console.log('Authentication service is up on http://localhost:' + port)
});

module.exports = app;
