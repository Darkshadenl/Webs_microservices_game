require('./mongooseConnection');
const setupForReceivingRPC = require("./rabbitMQ/rpc");

(async () => {
    let success = false;

    while (!success) {
        success = await setupForReceivingRPC();

        if (!success) {
            console.log('RabbitMQ not available yet, retrying in 5 seconds');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            console.log('RabbitMQ is ready');
        }
    }
})();

const express= require('express');
const targetRouter = require('./routes/targetRouter');
const testRouter = require('./routes/testRouter');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const passport = require('passport');
const strategy = require('../config/passportStrategy');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(strategy.InternalStrategy);
app.use(passport.initialize());


// Routing
app.get('/', async (req, res, next) => {
    res.render('index', {title: 'index'})
})

app.get('/test', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('test');
} )

app.use('/target', targetRouter);
app.use('/random', testRouter);

// catch 404 and forward to error handler
app.use(function (req,
                  res,
                  next) {
    next(createError(404));
});

// error handler
app.use(function (err,
                  req,
                  res,
                  next) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    if (req.app.get('env') === 'dev' || req.app.get('env') === 'debug') {
        res.locals.error = err;
    } else {
        res.locals.error = {};
    }

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
