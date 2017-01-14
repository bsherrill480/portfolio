'use strict';

const cron = require('cron'),
    moment = require('moment'),
    modelsAPI = require('../../db/model/models'),
    _ = require('lodash'),
    eventGeneratorsAPI = modelsAPI.eventGeneratorAPI,
    mailer = require('../../mailer');

function getEventGenerators() {
    const now = moment(),
        hourAgo = moment().subtract(1, 'hour');
    eventGeneratorsAPI.findEventGeneratorsByNextReminderDate(hourAgo, now)
        .then(function (eventGenerators) {
            _.each(eventGenerators, function (eventGenerator) {
                mailer.sendEventReminderEmail(eventGenerator);
            });
        })
        .catch(function (err) {
            console.log('cron getEventGenerators err', err);
        });
}

function getJob() {
    return new cron.CronJob({
        cronTime: '0 * * * *',
        onTick: function () {
            console.log('sending event reminder emails')
        },
        start: false
    })
}

module.exports = {
    getJob: getJob,

    _getEventGenerators: getEventGenerators
};
