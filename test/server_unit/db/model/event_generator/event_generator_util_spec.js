const eventGeneratorUtil
    = require('../../../../../server/db/model/event_generator/event_generator_util'),
    moment = require('moment');

function generateMockEventDate(intervalYear, intervalMonth, intervalDay, date, isReoccurring) {
    return {
        intervalYear: intervalYear,
        intervalMonth: intervalMonth,
        intervalDay: intervalDay,
        date: date,
        isReoccurring: isReoccurring
    };
}

describe('shouldSetNextEventDate', function () {
    it('should require both interval and isReoccurring', function () {
        const now = moment();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(1, 1, 1, now, false)
        )).toBeFalsy();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(1, 1, 1, now, true)
        )).toBeTruthy();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(0, 0, 0, now, true)
        )).toBeFalsy();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(1, 0, 0, now, true)
        )).toBeTruthy();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(0, 1, 0, now, true)
        )).toBeTruthy();
        expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(0, 0, 1, now, true)
        )).toBeTruthy();
         expect(eventGeneratorUtil._shouldSetNextEventDate(
            generateMockEventDate(0, 0, 1, moment().add(1, 'day'), true)
        )).toBeFalsy();
               
    });
});

describe('eventDateToReminder', function () {
    it('should subtract over appropriately', function () {
        const initDate = moment('2017-01-03'),
            timeToSubtract = 24, // hours
            reminderDate = eventGeneratorUtil._eventDateToReminderDate(initDate, timeToSubtract),
            expectedDate = moment('2017-01-02');
        expect(expectedDate.isSame(reminderDate)).toBeTruthy();
    });
});

describe('addEventGeneratorIntervalToDate', function () {
    it('should add correctly', function () {
        const initDate = moment('2017-06-15'),
            eventGenerator = generateMockEventDate(1, 1, 1, null, true),
            expectedDate = moment('2019-08-17');
        eventGeneratorUtil._addEventGeneratorIntervalToDate(eventGenerator, initDate, 2);
        expect(expectedDate.isSame(initDate)).toBeTruthy();
    });
});

describe('getApproxIntervalInDays', function () {
    it('should treat years at 365, months as 28, and days as 1', function () {
        const eventGenerator = generateMockEventDate(1, 1, 1, null, true),
            expectedDays = 366 + 31 + 1;
        expect(eventGeneratorUtil._getApproxIntervalInDays(eventGenerator)).toBe(expectedDays);
    });
});

describe('getApproxNumIntervalsToDate', function () {
    it('return 0 date is same day', function () {
        const now = moment(),
            eventGenerator = generateMockEventDate(1, 1, 1, now, true);
        expect(eventGeneratorUtil._getApproxNumIntervalsToDate(eventGenerator, now)).toBe(0);
    });

     it('return 1 date is 1 day diff', function () {
        const now = moment(),
            oneDay = moment().add(1, 'day'),
            eventGenerator = generateMockEventDate(0, 0, 1, now, true);
        expect(eventGeneratorUtil._getApproxNumIntervalsToDate(eventGenerator, oneDay)).toBe(1);
    });

    it('return value close', function () {
        const  threeYearsAgo = moment().subtract(9, 'years'),
            now = moment(),
            eventGenerator = generateMockEventDate(1, 6, 0, threeYearsAgo, true),
            numIntervals = eventGeneratorUtil._getApproxNumIntervalsToDate(eventGenerator, now);
        expect(numIntervals).toBeLessThan(7);
        expect(numIntervals).toBeGreaterThan(4); // just picking ot make sure it stays close
    });

    it('return value close 2', function () {
        const yearsAgo = 100,
            MONTHS_PER_YEAR = 12,
            timeAgoDate = moment().subtract(yearsAgo, 'years'),
            now = moment(),
            eventGenerator = generateMockEventDate(0, 1, 0, timeAgoDate, true),
            numIntervals = eventGeneratorUtil._getApproxNumIntervalsToDate(eventGenerator, now);
        expect(numIntervals).toBeLessThan(MONTHS_PER_YEAR * yearsAgo);
        // Error grows unbounded by time, but pretty slowly.
        // Putting this in there to show that long after I'm dead, running the worst case scenario
        // it still only requires 22 intervals to get back to the correct date.
        // i.e. this algorithm isn't a perfect solution, but in practice it'll be fine.
        // AS LONG AS, I limit the farthest back date a user can put in. I'll probably choose 1970.
        expect(numIntervals).toBe(MONTHS_PER_YEAR * yearsAgo - 22);
    });
});

describe('addNextReminderDateToEventGenerator', function () {
    it('if same day, should correctly', function () {
        const now = moment(),
            newEventDate = moment().add(1, 'day').add(1, 'month').add(1, 'year'),
            reminderDate = eventGeneratorUtil._eventDateToReminderDate(
                newEventDate,
                eventGeneratorUtil._SEND_REMINDER_DIFF
            ),
            eventGenerator = generateMockEventDate(1, 1, 1, now, true);
        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        const dateIsRight = moment(eventGenerator.nextReminderDate).isSame(reminderDate);
        expect(dateIsRight).toBeTruthy();
    });

    it('if yesterday, should set correctly', function () {
        const yesterday = moment().subtract(1, 'day'),
            // don't add 1 day because we start at yesterday
            newEventDate = moment().add(1, 'month').add(1, 'year'),
            reminderDate = eventGeneratorUtil._eventDateToReminderDate(
                newEventDate,
                eventGeneratorUtil._SEND_REMINDER_DIFF
            ),
            eventGenerator = generateMockEventDate(1, 1, 1, yesterday, true);
        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        const dateIsRight = moment(eventGenerator.nextReminderDate).isSame(reminderDate);
        expect(dateIsRight).toBeTruthy();
    });

    it('if tomorrow, should set reminder to today', function () {
        const tomorrow = moment().add(1, 'day'),
            // don't add 1 day because we start at yesterday
            reminderDate = moment(),
            eventGenerator = generateMockEventDate(1, 1, 1, tomorrow, true);
        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        const dateIsRight = moment(eventGenerator.nextReminderDate).isSame(reminderDate);
        expect(dateIsRight).toBeTruthy();
    });

    it('even if numIntervals is underestimated, it should still get the date correct', function () {
        const nineYearsAgo = moment().subtract(9, 'years').add(1, 'day'),
            reminderDate = moment(),
            eventGenerator = generateMockEventDate(1, 6, 0, nineYearsAgo, true);

        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        const dateIsRight = moment(eventGenerator.nextReminderDate).isSame(reminderDate);
        expect(dateIsRight).toBeTruthy();
    });
});
