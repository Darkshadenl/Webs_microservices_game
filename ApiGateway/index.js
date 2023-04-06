const express = require('express');
const app = express();
const port = process.env.PORT || 3003;
const cors = require('cors');
const strategy = require('../config/passportStrategy');
const passport = require('passport');
const { default: axios } = require('axios');

require('dotenv').config();

const interceptor = require('../config/interceptor');
const targetRouter = require('./routes/target')
const scoreRouter = require('./routes/score')

// Generic Express setup
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Passport setup
passport.use(strategy.InternalStrategy);
app.use(passport.initialize());

// // JWT header injection setup
axios.interceptors.request.use(interceptor);

// Routes
app.use('/auth', require('./routes/auths'));
app.use('/score', passport.authenticate('jwt', {session: false}), scoreRouter);
app.use('/target', passport.authenticate('jwt', {session: false}), targetRouter);

app.get('/test', (req, res) => {
    res.send('test');
})

app.listen(port, () => {
    console.log('Gateway is up on http://localhost:' + port);
})

module.exports = app;
