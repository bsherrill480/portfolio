'use strict';

// https://github.com/mattrobenolt/node-snsclient
var https = require('https'),
    express = require('express'),
    router = express.Router(),
    MessageValidator = require('sns-validator'),
    validator = new MessageValidator();


router.post('/receive', function (req, res, next) {
    const message = req.body;
    res;
    console.log('sns req:', req);
    console.log('sns message', message);
    validator.validate(message, function (err, message) {
        if (err) {
            console.error('sns validate err', err);
            return;
        }

        if (message['Type'] === 'SubscriptionConfirmation') {
            https.get(message['SubscribeURL'], function () {
                // You have confirmed your endpoint subscription
            });
        }
    });
});

module.exports = router;
