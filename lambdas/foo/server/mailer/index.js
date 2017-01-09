const
    // envs = require('../config/envs'),
    // env = process.env.NODE_ENV,
    config = require('../config/get_config')(),
    nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    transporter = nodemailer.createTransport(sesTransport({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_KEY,
        region: config.AWS_DEFAULT_REGION
    }));

module.exports = {
    sendMail: function (mailOptions) {
        transporter.sendMail(mailOptions, function (err) {
            if(err) {
                console.log('sendMail err:', err);
            }
        });
    }
};
