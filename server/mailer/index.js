const
    config = require('../config/get_config')(),
    nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    defaultFrom = '"ezPlan" <admin@ezplan.io>', // sender address
    cache = require('../cache'),
    mailerUtil = require('./util'),
    transporter = nodemailer.createTransport(sesTransport({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_KEY,
        region: config.AWS_DEFAULT_REGION
    }));

function sendMail (mailOptions) {
    transporter.sendMail(mailOptions, function (err) {
        if(err) {
            console.log('sendMail err:', err);
        }
    });
}

function getSendVerificationEmailKey(code) {
    const KEY_IDENT = 'email-verification';
    return `${KEY_IDENT}:${code}`
}

function sendVerificationEmail(user) {
    const TIME_TO_EXPIRE = 60 * 60 * 24; // 24 hours
    mailerUtil.generateRandomUrlSafeString()
        .then(function (randString) {
            const key = getSendVerificationEmailKey(randString);
            cache.set(key, user._id, TIME_TO_EXPIRE)
                .then(function () {
                    const emailVerificationHref = `https://www.ezplan.io/Verify/Email/${randString}`;
                    console.log('emailVerificationHref', emailVerificationHref);
                    sendMail({
                        from: defaultFrom,
                        // list of receivers
                        to: user.email,
                        subject: 'Please verify your email address', // Subject line
                         // plaintext body
                        text: `Please verify your email address at ${emailVerificationHref}. 
                        This link will expire in 24 hours.`,
                        // html body
                        html: `Please verify your email address 
                               <a href="${emailVerificationHref}">here</a>. 
                               This link will expire in 24 hours.`
                    });
                    return null;
                })
                .catch(function (err) {
                    console.log('sendVerificaition cache error', err);
                });
            return randString;
        })
        .catch(function (err) {
            console.log('sendEmailVerification error', err);
        });
}

module.exports = {
    sendMail: sendMail,

    sendVerificationEmail: sendVerificationEmail,

    getSendVerificationEmailKey: getSendVerificationEmailKey
};
