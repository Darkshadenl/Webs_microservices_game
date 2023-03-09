const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const passport = require('passport');
const strategy = require('../config/passportStrategy');

// Generic Express setup
app.use(cors());
app.use(express.json());

//init passport
passport.use(strategy.InternalStrategy);
app.use(passport.initialize());


// Register routes
app.use('/',  require('./routes'));

app.listen(port,  () => {
    console.log('Authentication service is up on http://localhost:' + port)
});

module.exports = app;
