'use strict';

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
    })),
    modlesAPI = require('../db/model/models'),
    badEmailAPI = modlesAPI.badEmailAPI;

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
                    console.log('sending email to:', user.email);
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

function sendVerificationEmailIfUserGood(user) {
    callIfUserEmailOkay(user, sendVerificationEmail);
}


function callIfUserEmailOkay(user, callback) {
    const userEmail = user.email;

    // can be optimized with redis, storing good emails for short time (e.g. 24 hours)
    badEmailAPI
        .badEmailExists(userEmail)
        .then(function (emailExists) {
            if(!emailExists){
                callback(user);
            } else {
                console.log('bad email found for', userEmail)
            }
        })
        .catch(function (err) {
            console.log('checking if email is bad error', err);
        });
}

function sendEventReminderEmail(eventGenerator) {
    const displayDate = moment(eventGenerator.date).format('MMMM do YYYY');
    sendMail({
        from: defaultFrom,
        // list of receivers
        to: eventGenerator._user.email,
        subject: `Don\'t forget you need to ${eventGenerator.question}`, // Subject line
        // plaintext body
        text: `According to our records, on ${displayDate} you need to ${eventGenerator.question}.`,
        // html body
        html: `According to our records, on ${displayDate} you need to ${eventGenerator.question}.`
    });
}

function sendEventReminderEmailIfUserGood(eventGenerator) {
    callIfUserEmailOkay(eventGenerator._user, () => sendEventReminderEmail(eventGenerator));
}



module.exports = {
    sendMail: sendMail,

    sendVerificationEmail: sendVerificationEmailIfUserGood,

    getSendVerificationEmailKey: getSendVerificationEmailKey,

    sendEventReminderEmail: sendEventReminderEmailIfUserGood
};
