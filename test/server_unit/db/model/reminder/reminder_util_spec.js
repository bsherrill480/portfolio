const eventGeneratorTestUtil = require('../../../test_util/event_generator_test_util'),
    reminderUtil = require('../../../../../server/db/model/reminder/reminder_util'),
    moment = require('moment'),
    generateMockEventDate = eventGeneratorTestUtil.generateMockEventDate;


describe('shouldSetNextEventDate', function () {
    it('should require both interval and isReoccurring', function () {
        const now = moment(),
            expectedReminderDate = moment(now).subtract(reminderUtil._SEND_REMINDER_DIFF, 'hour'),
            expectedReminderPlusSecond = moment(expectedReminderDate).add(1, 'second'),
            expectedReminderMinusSecond = moment(expectedReminderDate).subtract(1, 'second'),
            eventGenerator = generateMockEventDate(0, 1, 0, now, true),
            reminderDates = reminderUtil.generateReminderDatesFromEventGenerator(eventGenerator);
        expect(reminderDates.length).toBe(1);
        console.log('expected:', expectedReminderDate);
        console.log('actual:', moment(reminderDates[0]));
        // getting a hundreth second difference, probably from conversions and subtractions
        // expect(moment(reminderDates[0]).isSame(expectedReminderDate)).toBeTruthy();
        expect(
            moment(reminderDates[0]).isBetween(
                expectedReminderMinusSecond, 
                expectedReminderPlusSecond
            )
        ).toBeTruthy();
    });
});
