let PassportLocalStategy = require('passport-local'),
    getConfig = require('../config/get_config'),
    config = getConfig(),
    models = require('../db/model/models'),
    userConsts = require('../db/model/user/user_consts'),
    userAPI = models.userAPI,
    localStrategy,
    deserializeUser,
    serializeUser,
    FacebookStrategy = require('passport-facebook').Strategy,
    facebookStrategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    googleStrategy;

serializeUser = function (user, done) {
    done(null, user._id);
};

deserializeUser = function (id, done) {
    userAPI
        .findUserById(id)
        .then(function (returnedUser) {
            done(null, returnedUser);
            return returnedUser;
        })
        .catch(function (err) {
            done(err);
        });
};

localStrategy = new PassportLocalStategy(
    // passport for some reason did not like be telling it to use 'email' as username
    function(email, password, done) {
    console.log('passport auth', email, password);
    userAPI
        .findUserByEmail(email)
        .then(function(user) {
            if (!user || !user.isValidPassword(password)) {
                done(null, false);
            } else {
                done(null, user);
            }
        })
        .catch(function (err) {
            console.log('passport local error', err);
            done(err);
        });
});

// in real app would use environmental variable for variables here
facebookStrategy = new FacebookStrategy({
    clientID: '320404104996627', // facebook app id
    clientSecret: 'caad76cc56f16b1d46abfe917d556cfb',
    callbackURL: config.facebookCallbackUrl,
    profileFields: ['id', 'emails'],
    passReqToCallback: true

},
    function(req, accessToken, refreshToken, profile, done) {
        const emails = profile.emails, // for simplicity sake we'll just take the first email
            fbId = profile.id,
            email = emails[0] ? emails[0].value : '';
        if(!req.user) {
            if (email && fbId) {
                userAPI
                    .findOrCreate({
                        'facebook.facebookEmail': email
                    }, {
                        email: email,
                        emailState: userConsts.VERIFIED,
                        isFacebookUser: true,
                        isGoogleUser: false
                    })
                    .then(function (user) {
                        user.isFacebookUser = true;
                        user.facebook.id = fbId;
                        user.facebook.token = accessToken;
                        user.facebook.facebookEmail = email;
                        user.save()
                            .then(function () {
                                done(null, user);
                            })
                            .catch(done)
                    })
                    .catch(done);
            } else {
                done('email/fbId Invalid or missing.')
            }
        } else {
            const user = req.user;
            user.isFacebookUser = true;
            user.facebook.id = fbId;
            user.facebook.token = accessToken;
            user.facebook.facebookEmail = email;
            user.save()
                .then(function () {
                    done(null, user);
                })
                .catch(done)
        }
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
googleStrategy = new GoogleStrategy({
    clientID: config.googleClient,
    clientSecret: config.googleSecret,
    callbackURL: config.googleCallbackUrl,
    passReqToCallback: true

},
    function(req, accessToken, refreshToken, profile, done) {
        const emails = profile.emails, // for simplicity sake we'll just take the first email
            id = profile.id,
            email = emails[0] ? emails[0].value : '';
        console.log('email', email);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        if(!req.user) {
            if (email && id) {
                userAPI
                    .findOrCreate({
                        'google.googleEmail': email
                    }, {
                        email: email,
                        isFacebookUser: false,
                        isGoogleUser: true,
                        emailState: userConsts.VERIFIED
                    })
                    .then(function (user) {
                        user.isGoogleUser = true;
                        user.google.accessToken = accessToken;
                        user.google.id = id;
                        user.save()
                            .then(function () {
                                done(null, user);
                            })
                            .catch(done);
                    })
                    .catch(function (err) {
                        done(err);
                    });
            } else {
                done('email/id Invalid or missing.')
            }
        } else {
            const user = req.user;
            user.isGoogleUser = true;
            user.google.accessToken = accessToken;
            user.google.id = id;
            user.emailState = userConsts.VERIFIED;
            user.save()
                .then(function () {
                    done(null, user);
                })
                .catch(done);
        }
    }
);

module.exports = {
    serializeUser,
    deserializeUser,
    localStrategy,
    facebookStrategy,
    googleStrategy
};

