'use strict';

// https://github.com/aws/aws-js-sns-message-validator
var // https = require('https'), // for confirmation of subscription
    express = require('express'),
    router = express.Router(),
    MessageValidator = require('sns-validator'),
    _ = require('lodash'),
    modelsAPI = require('../../../db/model/models'),
    badEmailAPI = modelsAPI.badEmailAPI,
    validator = new MessageValidator();


router.post('/receive', function (req, res, next) {
    const message = req.body;
    console.log('sns message', message);
    validator.validate(message, function (err, message) {
        if (err) {
            res.status(500).send();
            console.error('sns validate err', err);
            return;
        }
        const messageType = message['Type'];

        if (messageType === 'SubscriptionConfirmation') {
            // we have already verified subsubscription
            // https.get(message['SubscribeURL'], function () {
                // You have confirmed your endpoint subscription
            // });
        } else if (messageType === 'Notification') {
            const bouncedMessage = JSON.parse(message.Message),
                notificationType = bouncedMessage.notificationType;
            let badEmails = null; // array of objects w/ at least "emailAddress"

            if(notificationType === 'Complaint') {
                badEmails = bouncedMessage.complaint.complainedRecipients;
            } else if (notificationType === 'Bounce') {
                badEmails = bouncedMessage.bounce.bouncedRecipients;
            } //   else some other notification type, e.g. changed settings

            if(badEmails) {
                _.each(badEmails, function (badEmailObj) {
                    const email = badEmailObj.emailAddress;
                    badEmailAPI.createBadEmail(email)
                        .catch(function (err) {
                            console.log('bad email err', err);
                        });
                });
            }
        } else {
            console.log('unrecognized type', messageType)
        }
        res.send();
    });
});

module.exports = router;
