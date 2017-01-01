const express = require('express'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    userAPI = models.userAPI,
    userConsts = require('../../../db/model/user/user_consts'),
    apiUtil = require('../api_util'),
    passport = require('passport'),
    googleScope = ['https://www.googleapis.com/auth/calendar.readonly', 'email'],
    facebookScope = ['email'];

function getLoginUserThenSendResponseCallback(req, res) {
    return function (user) {
        req.login(user, function (err) {
            if(err) {
                // res.status(500).json({error: err});
                apiUtil.errorResponse(res, 500, err)
            } else {
                apiUtil.formatUserResponse(user);
                res.json(user)
            }
        });
        return user;
    };
}

function emailTaken(user) {
    return userAPI.findUserByEmail(user.email)
}

function registerUserIsValid(user) {
    return user.email && user.password;
}

function loginUserIsValid(user) {
    return user.email && user.password
}

router.post('/login', passport.authenticate('local'), function (req, res, next) {
    const user = req.user;
    if(loginUserIsValid(user)) {
        apiUtil.formatUserResponse(user);
        res.json(user);
    } else {
        apiUtil.badParamsJsonResponse(res);
    }
});

router.post('/logout', function (req, res, next) {
    req.logout();
    res.send();
});

router.post('/register', function (req, res, next) {
    let user = req.body,
        loginUser = getLoginUserThenSendResponseCallback(req, res);
    user.emailState = userConsts.UNVERIFIED;
    user.isFacebookUser = false;
    user.isGoogleUser = false;
    if(registerUserIsValid(user)) {
        emailTaken(user)
            .then(function (isEmailTaken) {
                if(isEmailTaken) {
                    apiUtil.errorResponse(res, 409, 'Email taken.')
                } else {
                    userAPI
                        .createUser(user)
                        .then(loginUser)
                        .catch(apiUtil.queryFailedCallback(res));
                }
            })
            .catch(apiUtil.queryFailedCallback(res));
    } else {
        apiUtil.badParamsJsonResponse(res)
    }
});

router.get('/userId', function (req, res, next) {
    res.json({_id: req.isAuthenticated() ? req.user._id : ''});
});

// ========
// FACEBOOK
// ========
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/facebook', passport.authenticate('facebook', {scope: facebookScope}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/facebook/connect', passport.authorize('facebook', {scope: facebookScope}));

router.get('/facebook/connect/callback',
    passport.authorize('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));


// =======
// GOOOGLE
// =======

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google', passport.authenticate('google', { scope: googleScope }));

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/Login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/google/connect', passport.authorize('google', { scope: googleScope }));

router.get('/google/connect/callback',
  passport.authorize('google', { failureRedirect: '/Login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
