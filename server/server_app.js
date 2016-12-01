const express = require('express'),
  path = require('path'),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  // mongoose = require('mongoose'),
  dbInitialize = require('./db/initialize'),
  routes = require('./routes'),
  app = express(),
  envs = require('./config/envs'),
  env = app.get('env'),
  getConfig = require('./config/get_config'),
  config = getConfig(env);

// var passport = require('passport');
// var assignment = require('./routes/assignment');
// var auth = require('./auth');
// var expressSession = require('express-session');

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'build')));

// app.use(expressSession({
//   secret: 'keyboard cat', // in prod this should be an ENV variable
//   resave: false,
//   saveUninitialized: false
// }));
// passport.serializeUser(auth.serializeUser);
// passport.deserializeUser(auth.deserializeUser);
// passport.use(auth.localStrategy);
// passport.use(auth.facebookStrategy);
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (env === envs.DEVELOPMENT) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//setup db
dbInitialize(env);
// mongoose.connect(config.connectionString);
// mongoose.Promise = require('bluebird');

module.exports = app;
