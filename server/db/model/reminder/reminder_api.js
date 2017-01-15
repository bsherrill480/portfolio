'use strict';

const Reminder = require('./reminder_model');


// options:
//   user,
//   eventGenerator
//   date
function createReminder(options) {
    const reminder = new Reminder(options);
    return reminder.save();
}

function findReminderByDate(date) {
    return Reminder.find({date: date}).exec()
}

function findRemindersByEventGenerator(eventGeneratorId) {
    return Reminder.find({_eventGenerator: eventGeneratorId}).exec();
}

function deleteRemindersForEventGenerator(eventGeneratorId) {
    return Reminder.remove({_eventGenerator: eventGeneratorId}).exec();
}

//all functions return promises
module.exports = {

    createReminder: createReminder,

    findReminderByDate: findReminderByDate,

    findReminderByEventGenerator: findRemindersByEventGenerator,

    deleteRemindersForEventGenerator: deleteRemindersForEventGenerator
};
