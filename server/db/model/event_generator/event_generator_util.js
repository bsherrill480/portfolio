const moment = require('moment');

// default nextEventDate is based off eventGenerator.date, only need to run algo
// under certain conditions
function shouldRunAlgoForNextEventDate(eventGenerator) {
    const now = moment();
    console.log('should run algo:', eventGenerator.question, eventGenerator.isReoccurring, (
        eventGenerator.intervalYear ||
        eventGenerator.intervalMonth ||
        eventGenerator.intervalDay), moment(eventGenerator.date).isSameOrBefore(now));
    // if eventGeneratorDate is after now, then we can just wait until then to start the algo.
    // i.e. afterNow => return false
    return eventGenerator.isReoccurring && (
        eventGenerator.intervalYear ||
        eventGenerator.intervalMonth ||
        eventGenerator.intervalDay) && moment(eventGenerator.date).isSameOrBefore(now);
}

// function eventDateToReminderDate(eventDate, reminderDifference) {
//     const reminderDate = moment(eventDate);
//     reminderDate.subtract(reminderDifference, 'hours');
//     return reminderDate;
// }

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

function addNextEventDateToEventGenerator(eventGenerator) {
    const currentDate = moment(),
        eventDate = moment(eventGenerator.date);
    // set the default nextEventDate to just be the date of the event
    eventGenerator.nextEventDate = eventGenerator.date;
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
        eventGenerator.nextEventDate = nextEventDate.toDate();
    }
}

module.exports = {
    _getApproxNumIntervalsToDate: getLEQNumIntervalsToDate,
    
    _getApproxIntervalInDays: getGEQIntervalInDays,
    
    _addEventGeneratorIntervalToDate: addEventGeneratorIntervalToDate,
    
    _shouldSetNextEventDate: shouldRunAlgoForNextEventDate,
    
    addNextEventDateToEventGenerator: addNextEventDateToEventGenerator
};
