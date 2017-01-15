const moment = require('moment'),
    SEND_REMINDER_DIFF = 24; // eventually this should be individual to user.

function generateReminderDatesFromEventGenerator(eventGenerator) {
    return [moment(eventGenerator.nextEventDate).subtract(SEND_REMINDER_DIFF, 'hour').toDate()];
}

module.exports = {
    _SEND_REMINDER_DIFF: SEND_REMINDER_DIFF,
    generateReminderDatesFromEventGenerator: generateReminderDatesFromEventGenerator
};
