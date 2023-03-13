const express = require('express');
const app = express();
const port = process.env.PORT || 3010;
const cors = require('cors');
const strategy = require('../config/passportStrategy');
const passport = require('passport');
const interceptor = require('../config/interceptor');

require('dotenv').config();

// Generic Express setup
app.use(cors());
app.use(express.json());

// Passport setup
passport.use(strategy.InternalStrategy);
app.use(passport.initialize());

// JWT header injection setup
const { default: axios } = require('axios');
axios.interceptors.request.use(interceptor);

// Register imported routes
  app.use('/auth', require('./routes/auths'));


app.listen(port, () => {
    console.log('Gateway is up on http://localhost:' + port);
})

module.exports = app;
