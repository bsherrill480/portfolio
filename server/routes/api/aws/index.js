'use strict';

// https://github.com/mattrobenolt/node-snsclient
var express = require('express'),
    router = express.Router(),
    config = require('../../../config/get_config')(),
    SNSClient = require('aws-snsclient');

var auth = {
    region: config.AWS_DEFAULT_REGION,
    topic: config.AWS_BOUNCED_EMAIL_SNS_ARN
};

var client = SNSClient(auth, function(err, message) {
    console.log(message);
});

router.post('/receive', client);

module.exports = router;
