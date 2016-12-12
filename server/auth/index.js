let PassportLocalStategy = require('passport-local'),
    models = require('../db/model/models'),
    userAPI = models.userAPI,
    localStrategy,
    deserializeUser,
    serializeUser,
// in prod we would make these environmental variabeles so they don't need to live in code
    googClientId = '176316419365-kptpt2gp57tldfu27h2b97o872bnap44.apps.googleusercontent.com',
    googSec = 'Xr_5ypwF-dNbcdtEJNQWNl8e',
    FacebookStrategy = require('passport-facebook').Strategy,
    facebookStrategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    googleStrategy;

serializeUser = function (user, done) {
    console.log('deserialize user', user);
    done(null, user._id);
};

deserializeUser = function (id, done) {
    console.log('serialize user', id);
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
                console.log('failed: ', user, user.isValidPassword(password));
                done(null, false);
            } else {
                console.log('successs: ', user);
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
    callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'emails']

},
    function(accessToken, refreshToken, profile, done) {
        let emails = profile.emails, // for simplicity sake we'll just take the first email
            fbId = profile.id,
            email;
        email = emails[0] ? emails[0].value : '';
        console.log('facebookStrat', email, fbId);
        if(email && fbId) {
            console.log('Gonna create this user', email, fbId);
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

googleStrategy = new GoogleStrategy({
    clientID: googClientId,
    clientSecret: googSec,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    // profileFields: ['id', 'emails'] // in routes
    // callbackURL: "http://www.example.com/auth/google/callback"
},
    function(accessToken, refreshToken, profile, done) {
        let emails = profile.emails, // for simplicity sake we'll just take the first email
            id = profile.id,
            email;
        console.log('google profile', profile);
        email = emails[0] ? emails[0].value : '';
        console.log('googleStrat', email, id);
        if(email && id) {
            console.log('Gonna create this user', email, id);
            userAPI
                .findOrCreate({
                    email: email,
                    google: {
                        id: id
                    }
                })
                .then(function (user) {
                    done(null, user);
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

