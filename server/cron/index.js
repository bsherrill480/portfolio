'use strict';

const sendEventRemindersCron = require('./sendEventReminders');

function start() {
    const sendEventRemindersJob = sendEventRemindersCron.getJob();
    sendEventRemindersJob.start();
}

module.exports = {
    start: start
};
