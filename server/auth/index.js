let PassportLocalStategy = require('passport-local'),
    getConfig = require('../config/get_config'),
    config = getConfig(),
    models = require('../db/model/models'),
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
    profileFields: ['id', 'emails']

},
    function(accessToken, refreshToken, profile, done) {
        let emails = profile.emails, // for simplicity sake we'll just take the first email
            fbId = profile.id,
            email;
        email = emails[0] ? emails[0].value : '';
        if(email && fbId) {
            userAPI
                .findOrCreate({
                    email: email,
                    facebook: {
                        id: fbId
                    }
                })
                .then(function (user) {
                    done(null, user);
                })
                .catch(function (err) {
                    done(err);
                });
        } else {
            done('email/fbId Invalid or missing.')
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
    // profileFields: ['id', 'emails'] // in routes
    // callbackURL: "http://www.example.com/auth/google/callback"
},
    function(accessToken, refreshToken, profile, done) {
        let emails = profile.emails, // for simplicity sake we'll just take the first email
            id = profile.id,
            email;
        email = emails[0] ? emails[0].value : '';
        if(email && id) {
            userAPI
                .findOrCreate({
                    email: email,
                    // google: {
                    //     id: id
                    // }
                })
                .then(function (user) {
                    user.google.accessToken = accessToken;
                    user.google.id = id;
                    user.save()
                        .then(function () {
                            done(null, user);
                        })
                        .catch(function (err) {
                            done(err);
                        });
                })
                .catch(function (err) {
                    done(err);
                });
        } else {
            done('email/id Invalid or missing.')
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

