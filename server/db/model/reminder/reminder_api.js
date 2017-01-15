'use strict';

const Reminder = require('./reminder_model');

//all functions return promises
module.exports = {
    // options:
    //   user,
    //   eventGenerator
    //   date
    createReminderEmail(options) {
        const reminder = new Reminder();
        reminder._user = options.user;
        reminder._eventGenerator = options.eventGenerator;
        reminder.date = options.date;
        return reminder.save();
    },

    findReminderByDate(date) {
        return Reminder.find({date: date}).exec()
    },
    
    findReminderByEventGenerator(eventGenerator) {
        return Reminder.find({_eventGenerator: eventGenerator}).exec();
    }
};
