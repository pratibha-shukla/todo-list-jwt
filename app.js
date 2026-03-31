var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// --- 1. Import Routes from your custom 'expresslist' folder ---
var authRouter = require('./expresslist/routes/auth'); 
var listRouter = require('./expresslist/routes/list'); 

// Default generator routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. Mount your Custom Routes ---
app.use('/auth', authRouter);      // Handles /signup, /login, /me
app.use('/lists', listRouter); // Handles /lists

// Default routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error'; // ADD THIS LINE

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

