'use strict';

const cron = require('cron'),
    moment = require('moment'),
    modelsAPI = require('../../db/model/models'),
    _ = require('lodash'),
    remindersAPI = modelsAPI.reminderAPI,
    Promise = require('bluebird'),
    mailer = require('../../mailer');

function sendRemindersJob() {
    // I could see there could be a few missed milliseconds. I should eventually make it so that
    // it uses previous time instead of doing hourAgo
    const now = moment(),
        hourAgo = moment().subtract(1, 'hour');

    return new Promise(function (resolve, reject) {
        const promisesAll = [];

        remindersAPI.findRemindersByDate(hourAgo, now)
            .then(function (reminders) {
                // just resave them all, and the API should notice nextEventDate is expired and
                // update it
                _.each(reminders, function (reminder) {
                    promisesAll.push(
                        remindersAPI.deleteReminder(reminder._id)
                    );
                    mailer.sendEventReminderEmail(reminder)
                });
                Promise.all(promisesAll)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(function (err) {
                console.log('cron getEventGenerators err', err);
                reject(err);
            });
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

    _sendRemindersJob: sendRemindersJob
};
