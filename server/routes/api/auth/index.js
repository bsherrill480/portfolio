const express = require('express'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    userAPI = models.userAPI,
    apiUtil = require('../api_util'),
    passport = require('passport');

function getLoginUserThenSendResponseCallback(req, res) {
    return function (user) {
        req.login(user, function (err) {
            if(err) {
                res.status(400).send(err);
            } else {
                apiUtil.formatUserResponse(user);
                res.json(user)
            }
        });
        return user;
    };
}

router.post('/login', passport.authenticate('local'), function (req, res, next) {
    const user = req.user;
    apiUtil.formatUserResponse(user);
    res.json(user);
});

router.post('/logout', function (req, res) {
    req.logout();
    res.send();
});

router.post('/register', function (req, res, next) {
    let user = req.body,
        loginUser = getLoginUserThenSendResponseCallback(req, res);
    userAPI.createUser(user).then(loginUser);
});

router.get('/userId', function (req, res, next) {
    // console.log("loggedin",req.isAuthenticated() ? 'isLoggedIn' : 'notIsLoggedIn', req.user, 'id: ', req.user._id);
    res.json({userId: req.isAuthenticated() ? req.user._id : ''});
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: 'http://localhost:3000/assignment/#/user',
        failureRedirect: 'http://localhost:3000/assignment/#/login' }));

module.exports = router;
