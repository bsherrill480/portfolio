const express = require('express'),
    util = require('../api_util'),
    router = express.Router(),
    // models = require('../../../db/model/models'),
    getConfig = require('../../../config/get_config'),
    config = getConfig(),
    // userAPI = models.userAPI,
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

function userIsGoogleUser(req, res, next) {
    if(req.user.google.id && req.user.google.accessToken) {
        next();
    } else {
        util.errorResponse(res, 400, 'Only google users');
    }
}

// https://github.com/google/google-api-nodejs-client#making-authenticated-requests
function getGoogleEvents(req, res, next, accessToken = '', refreshToken = '',
                         secondAttempt = false) {
    // want to use secondAttempt in case google gives up falsey accessToken and refreshToken
    // so we don't go into an infinite loop
    const oauth2Client = new OAuth2(
        config.googleClient,
        config.googleSecret,
        ''),
        credentials = {},
        calendar = google.calendar('v3');
    // eslint won't let me make object directly
    credentials['access_token'] = secondAttempt ? accessToken : req.user.google.accessToken;
    credentials['refresh_token'] = secondAttempt ? refreshToken : req.user.google.refreshToken;
    oauth2Client.setCredentials(credentials);
    calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime'
    }, function (err, response) {
        if(err) {
            if(secondAttempt) {
                // lets send them to reauth, most likely refresh token expired or revoked
                res.json({
                    error: 'REDO_AUTH'
                });
            } else {
                // google gave us an error, lets try refreshing the access token, it also sends 
                // back the refreshToken so we'll go ahead an store that just in case it somehow
                // has been changed.
                oauth2Client.refreshAccessToken(function (err, tokens) {
                    if (err) {
                        util.errorResponse(res, 500, err)
                    } else {
                        const accessToken = tokens['access_token'],
                            refreshToken = tokens['refresh_token'];
                        user.google.accessToken = accessToken;
                        user.google.refreshToken = refreshToken;
                        user.save()
                            .then(function () {
                                getGoogleEvents(req, res, next, accessToken, refreshToken, true)
                            })
                            .catch(function (err) {
                                util.errorResponse(res, 500, err)
                            });
                    }
                });
            }
        } else {
            const events = response.items;
            console.log('events length', events.length);
            // if(events.length != 0) {
            //     console.log('upcoming events');
            //     for (var i = 0; i < events.length; i++) {
            //         var event = events[i];
            //         var start = event.start.dateTime || event.start.date;
            //         console.log('%s - %s', start, event.summary);
            //     }
            // }
            res.json(events);
        }
    })
}


router.get('/google_events', util.userIsLoggedIn, userIsGoogleUser, getGoogleEvents);
//
// router.put('/:userId', function (req, res, next) {
//     let receivedUser = req.body,
//         userId = req.params.userId;
//     util.removeInternalUserAttributes(receivedUser);
//     util.queryResponse(res, userAPI.updateUser(userId, receivedUser).then(util.formatUserResponse));
// });

module.exports = router;
