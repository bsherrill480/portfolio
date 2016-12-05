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
    passport = require('passport'),
    auth = require('./auth'),
    envs = require('./config/envs'),
    expressSession = require('express-session');

let calledBefore = false;

module.exports = function(passedEnv) {
    if(!calledBefore) {
        let env = passedEnv || app.get('env');

        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '..', 'build')));

        app.use(expressSession({
            secret: 'keyboard cat', // in prod this should be an ENV variable
            resave: false,
            saveUninitialized: false
        }));

        passport.serializeUser(auth.serializeUser);
        passport.deserializeUser(auth.deserializeUser);
        passport.use(auth.localStrategy);
        passport.use(auth.facebookStrategy);
        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/', routes);

        // catch 404 and forward to error handler
        // no need to send 404, let front end
        // app.use(function(req, res, next) {
        //   var err = new Error('Not Found');
        //   err.status = 404;
        //   next(err);
        // });

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


        // don't run db in test, it's already setup by prep_test_db
        if(env !== envs.TEST) {
            dbInitialize(env);
        }
    }
    return app;
}
