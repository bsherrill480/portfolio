const
    // envs = require('../config/envs'),
    // env = process.env.NODE_ENV,
    nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    AWS = require('aws-sdk'),
    ses = new AWS.SES(),
    transporter = nodemailer.createTransport(sesTransport({
        ses: ses
    }));

module.exports = {
    sendMail: function (mailOptions) {
        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                console.log('sendMail err:', err);
            }
            console.log('messageSent:' + info.response);
        });
    }
};
