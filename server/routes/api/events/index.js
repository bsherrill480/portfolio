const express = require('express'),
    util = require('../api_util'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    getConfig = require('../../../config/get_config'),
    config = getConfig(),
    userAPI = models.userAPI,
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

function userIsGoogleUser(req, res, next) {
    console.log('user', req.user);
    if(req.user.google.id && req.user.google.accessToken) {
        next();
    } else {
        util.errorResponse(res, 400, 'Only google users');
    }
}

router.get('/google_events', util.userIsLoggedIn, userIsGoogleUser, function (req, res, next) {
    const oauth2Client = new OAuth2(
        config.googleClient,
        config.googleSecret,
        ''),
        credentials = {},
        calendar = google.calendar('v3');
    // eslint won't let me make object directly
    credentials['access_token'] = req.user.google.accessToken;
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
            console.log('err1', err);
            util.errorResponse(res, 500, err);
            return;
        }
        const events = response.items;
        if(events.length == 0) {
            console.log('no upcoming events');
        } else {
            console.log('upcoming events');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s', start, event.summary);
            }
        }
        res.json(events);
    })


});

router.put('/:userId', function (req, res, next) {
    let receivedUser = req.body,
        userId = req.params.userId;
    util.removeInternalUserAttributes(receivedUser);
    util.queryResponse(res, userAPI.updateUser(userId, receivedUser).then(util.formatUserResponse));
});

module.exports = router;
