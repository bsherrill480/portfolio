const moment = require('moment'),
    SEND_REMINDER_DIFF = 24; // eventually this should be individual to user.

// default nextEventDate is based off eventGenerator.date, only need to run algo
// under certain conditions
function shouldRunAlgoForNextEventDate(eventGenerator) {
    const now = moment();
    
    return eventGenerator.isReoccurring && (
        eventGenerator.intervalYear ||
        eventGenerator.intervalMonth ||
        eventGenerator.intervalDay) && moment(eventGenerator.date).isSameOrBefore(now);
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

// We should over estimate the days in the interval, so that the number of intervals
// will be minimized.
function getGEQIntervalInDays(eventGenerator) {
    return eventGenerator.intervalYear * 366 +
        eventGenerator.intervalMonth * 31 +
        eventGenerator.intervalDay;
}

// we want this to always undershoot because we're going to individually step the interval later.
// This will undershoot because getGEQIntervalInDays provides the max
function getLEQNumIntervalsToDate(eventGenerator, date) {
    const eventGenDate = moment(eventGenerator.date);
    console.log(`Math.floor(${date.diff(eventGenDate, 'days')} / ${getGEQIntervalInDays(eventGenerator)}`)
    return Math.floor(date.diff(eventGenDate, 'days') / getGEQIntervalInDays(eventGenerator));
}

function addNextReminderDateToEventGenerator(eventGenerator) {
    const currentDate = moment(),
        eventDate = moment(eventGenerator.date),
        nextReminderDate = eventDateToReminderDate(eventDate, SEND_REMINDER_DIFF);
    
    // set the default nextReminderDate to just be the date of the event minus reminder time.
    eventGenerator.nextReminderDate = nextReminderDate.toDate();
    
    if(shouldRunAlgoForNextEventDate(eventGenerator)) { 
        const approxNumIntervalsToCurrentDate
            = getLEQNumIntervalsToDate(eventGenerator, currentDate),
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

module.exports = {
    _SEND_REMINDER_DIFF: SEND_REMINDER_DIFF,
    _getApproxNumIntervalsToDate: getLEQNumIntervalsToDate,
    _getApproxIntervalInDays: getGEQIntervalInDays,
    _addEventGeneratorIntervalToDate: addEventGeneratorIntervalToDate,
    _eventDateToReminderDate: eventDateToReminderDate,
    _shouldSetNextEventDate: shouldRunAlgoForNextEventDate,
    addNextReminderDateToEventGenerator: addNextReminderDateToEventGenerator
};
