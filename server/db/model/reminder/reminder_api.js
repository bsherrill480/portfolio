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

function findRemindersByDate(lowerBound, upperBound) {
    const query = Reminder
        .find({
            date: {
                $gte: lowerBound,
                $lt: upperBound
            }
        })
        .populate('_eventGenerator')
        .populate('_user');
    return query.exec();
}

function findRemindersByEventGenerator(eventGeneratorId) {
    return Reminder.find({_eventGenerator: eventGeneratorId}).exec();
}

function deleteRemindersForEventGenerator(eventGeneratorId) {
    return Reminder.remove({_eventGenerator: eventGeneratorId}).exec();
}

function deleteReminder(reminderId) {
    return Reminder.remove({_id: reminderId}).exec();
}

//all functions return promises
module.exports = {

    createReminder: createReminder,

    findRemindersByDate: findRemindersByDate,

    findReminderByEventGenerator: findRemindersByEventGenerator,

    deleteRemindersForEventGenerator: deleteRemindersForEventGenerator,
    
    deleteReminder: deleteReminder
};
