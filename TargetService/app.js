require('./mongooseConnection');

const express= require('express');
const indexRouter = require('./routes/index');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', indexRouter);


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
