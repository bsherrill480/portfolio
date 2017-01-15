'use strict';

const cron = require('cron'),
    moment = require('moment'),
    modelsAPI = require('../../db/model/models'),
    _ = require('lodash'),
    eventGeneratorsAPI = modelsAPI.eventGeneratorAPI,
    reminderUtil = require('../../db/model/reminder/reminder_util'),
    Promise = require('bluebird');

function getEventGeneratorsAndSetNextEventDates() {
    // I could see there could be a few missed milliseconds. I should eventually make it so that
    // it uses previous time instead of doing hourAgo
    const now = moment(),
        hourAgo = moment().subtract(1, 'hour');

    return new Promise(function (resolve, reject) {
        const promisesAll = [];
        
        eventGeneratorsAPI.findEventGeneratorsByNextEventDate(hourAgo, now)
            .then(function (eventGenerators) {
                // just resave them all, and the API should notice nextEventDate is expired and 
                // update it
                _.each(eventGenerators, function (eventGenerator) {
                    promisesAll.push(
                        eventGeneratorsAPI.updateEventGenerator(eventGenerator._id, eventGenerator)
                    );
                    promisesAll.push(
                        reminderUtil.generateAndSaveRemindersFromEventGenerator(eventGenerator)
                    )
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

    _getEventGeneratorsAndSetNextEventDates: getEventGeneratorsAndSetNextEventDates
};
