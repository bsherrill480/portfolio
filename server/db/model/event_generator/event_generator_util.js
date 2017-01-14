const moment = require('moment'),
    SEND_REMINDER_DIFF = 24; // eventually this should be individual to user.

function shouldSetNextEventDate(eventGenerator) {
    return eventGenerator.isReoccurring &&
        eventGenerator.intervalYear &&
        eventGenerator.intervalMonth &&
        eventGenerator.intervalDay;
}

function eventDateToReminderDate(eventDate, reminderDifference) {
    const reminderDate = moment(eventDate);
    reminderDate.subtract(reminderDifference, 'hours');
    return reminderDate;
}

function addEventGeneratorIntervalToDate(eventGenerator, date, numTimes) {
    date.add(numTimes * eventGenerator.intervalYear, 'year');
    date.add(numTimes * eventGenerator.intervalMonth, 'month');
    date.add(numTimes * eventGenerator.intervalDay, 'day');
}

// should undershoot, not overshoot
function getApproxIntervalInDays(eventGenerator) {
    return eventGenerator.intervalYear * 365 +
        eventGenerator.intervalMonth * 7 +
        eventGenerator.intervalDay;
}

// should undershoot, not overshoot
function getApproxNumIntervalsToDate(eventGenerator, date) {
    return Math.floor(date.diff(eventGenerator.date, 'days') / getApproxIntervalInDays(eventGenerator))
}

function addNextReminderDateToEventGenerator(eventGenerator) {
    if(shouldSetNextEventDate(eventGenerator)) {
        const currentDate = moment(),
            eventDate = moment(eventGenerator.date);
        
        
        if(eventDate.isSameOrBefore(currentDate)) {
            // this could be refactored to pull this block to end, but I feel it's more
            // understandable when written like this.
            const nextReminderDate = eventDateToReminderDate(eventDate, SEND_REMINDER_DIFF);
            eventGenerator.nextReminderDate = nextReminderDate.toDate();
        } else {
            const approxNumIntervalsToCurrentDate
                = getApproxNumIntervalsToDate(eventGenerator, currentDate),
                nextEventDate = moment(eventDate);
            // bring it up as close as possible
            addEventGeneratorIntervalToDate(
                eventGenerator,
                nextEventDate,
                approxNumIntervalsToCurrentDate
            );
            // keep pushing until next date is in future
            while(nextEventDate.isSameOrBefore(currentDate)) {
                addEventGeneratorIntervalToDate(
                    eventGenerator,
                    nextEventDate,
                    1
                );
            }

            const nextReminderDate = eventDateToReminderDate(nextEventDate, SEND_REMINDER_DIFF);
            eventGenerator.nextReminderDate = nextReminderDate.toDate();
        }
    }
}



module.exports = {
    addNextReminderDateToEventGenerator: addNextReminderDateToEventGenerator
};
