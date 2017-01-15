const moment = require('moment'),
    reminderAPI = require('./reminder_api'),
    reminderConsts = require('./reminder_consts'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    SEND_REMINDER_DIFF = 24; // eventually this should be individual to user.

function generateReminderAttributesFromEventGenerator(eventGenerator) {
    const now = moment();
    // we don't need any reminders for a eventDate that is already past.
    if(moment(eventGenerator.nextEventDate).isBefore(now)) {
        return [];
    }
    return [{
        date: moment(eventGenerator.nextEventDate).subtract(SEND_REMINDER_DIFF, 'hour').toDate(),
        type: reminderConsts.EMAIL,
        _user: eventGenerator._user,
        _eventGenerator: eventGenerator._id
    }];
}

function generateAndSaveRemindersFromEventGenerator(eventGenerator) {
    console.log('generateAndSaveRemindersFromEventGenerator', eventGenerator);
    const reminderPromises = [];
    _.each(generateReminderAttributesFromEventGenerator(eventGenerator), function (reminderAttrs) {
        console.log('saving reminder', reminderAttrs);
        reminderPromises.push(reminderAPI.createReminder(reminderAttrs));
    });
    return Promise.all(reminderPromises);
}

module.exports = {
    _SEND_REMINDER_DIFF: SEND_REMINDER_DIFF,
    
    generateAndSaveRemindersFromEventGenerator: generateAndSaveRemindersFromEventGenerator,
    
    _generateReminderDatesFromEventGenerator: generateReminderAttributesFromEventGenerator
};
