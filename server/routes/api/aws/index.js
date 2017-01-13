'use strict';

// https://github.com/aws/aws-js-sns-message-validator
var https = require('https'),
    express = require('express'),
    router = express.Router(),
    MessageValidator = require('sns-validator'),
    validator = new MessageValidator();


router.post('/receive', function (req, res, next) {
    const message = req.body;
    console.log('sns message', message);
    validator.validate(message, function (err, message) {
        if (err) {
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
            console.log('got a notification', message);
        }
    });
});

module.exports = router;
