const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// CUSTOM MODULES
const db = require('./custom_modules/init-db');
const passportSetup = require('./custom_modules/passport-setup');

// create express app
var app = express();


// MIDDLEWARES
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default middlewares
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());


// ROUTERS
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const eventFormRouter = require('./routes/event-form');
const addEventRouter = require('./routes/add-event');
const authRouter = require('./routes/auth-routes');
// const authCallbackRouter = require('./routes/auth-callback');

// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter); // NOT USED!
app.use('/admin', adminRouter);
app.use('/event-form', eventFormRouter);
app.use('/add-event', addEventRouter);
app.use('/auth', authRouter);
//app.use('/auth-callback', authCallbackRouter);


const {
    fstat
} = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public')); // UNNECESSARY??
app.use(express.static('uploads'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;