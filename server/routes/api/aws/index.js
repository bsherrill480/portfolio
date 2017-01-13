'use strict';

// https://github.com/mattrobenolt/node-snsclient
var express = require('express'),
    router = express.Router(),
    config = require('../../../config/get_config')(),
    SNSClient = require('aws-snsclient');

var auth = {
    // region: config.AWS_DEFAULT_REGION,
    // topic: config.AWS_BOUNCED_EMAIL_SNS_ARN
    verify: false
};

var client = SNSClient(auth, function(err, message) {
    console.log(`region: ${config.AWS_DEFAULT_REGION}`);
    console.log(`topic: ${config.AWS_BOUNCED_EMAIL_SNS_ARN}`);
    console.log('sns message', message);
});

router.post('/receive', function (req, res, next) {
    console.log('req.body', req.body);
    next();
}, client);

module.exports = router;
