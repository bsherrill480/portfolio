'use strict';

const sendEventRemindersCron = require('./send_event_reminders');

function start() {
    const sendEventRemindersJob = sendEventRemindersCron.getJob();
    sendEventRemindersJob.start();
}

module.exports = {
    start: start
};
