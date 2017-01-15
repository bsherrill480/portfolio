'use strict';

const ReminderSchema = require('./reminder_schema'),
    mongoose = require('mongoose'),
    Reminder = mongoose.model('Reminder', ReminderSchema);

//all functions return promises
module.exports = Reminder;
