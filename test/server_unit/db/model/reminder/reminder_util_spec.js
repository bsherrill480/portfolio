const reminderUtil = require('../../../../../server/db/model/reminder/reminder_util'),
    eventGeneratorConsts
        = require('../../../../../server/db/model/event_generator/event_generator_consts'),
    reminderConsts = require('../../../../../server/db/model/reminder/reminder_consts'),
    models = require('../../../../../server/db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI,
    reminderAPI = models.reminderAPI,
    userTestUtil = require('../../../test_util/user_test_util'),
    moment = require('moment');

function mockEventGenerator(now) {
    return {
        question: 'foo',
        date: now.toDate(),
        intervalYear: 0,
        intervalMonth: 0,
        intervalDay: 1,
        isReoccurring: true,
        generatorType: eventGeneratorConsts.HOMEOWNER
    };
}
// getting a hundreth second difference, probably from conversions and subtractions
function expectDatesTheSameWithinEpsilon(date1, date2, epsilon) {
    const expectedReminderPlusEpsilon = moment(date2).add(epsilon, 'second'),
        expectedReminderMinusEpsilon = moment(date2).subtract(epsilon, 'second');
    expect(
        moment(date1).isBetween(
            expectedReminderMinusEpsilon,
            expectedReminderPlusEpsilon
        )
    ).toBeTruthy()
}

describe('shouldSetNextEventDate', function () {

    it('should require both interval and isReoccurring', function () {
        const now = moment(),
            nextEventDate = moment(now).add(1, 'second'),
            expectedReminderDate = moment(nextEventDate)
                .subtract(reminderUtil._SEND_REMINDER_DIFF, 'hour'),
            epsilon = 1,
            eventGenerator = {
                _user: '123',
                _id: 'abc',
                nextEventDate: nextEventDate
            },
            reminderDates = reminderUtil._generateReminderDatesFromEventGenerator(eventGenerator),
            reminderDate = reminderDates[0];
        expect(reminderDates.length).toBe(1);

        expectDatesTheSameWithinEpsilon(reminderDate.date, expectedReminderDate, epsilon);
        expect(reminderDate.type).toBe(reminderConsts.EMAIL);
        expect(reminderDate._user).toBe(eventGenerator._user);
        expect(reminderDate._eventGenerator).toBe(eventGenerator._id);
    });

    // testing generateAndSaveRemindersFromEventGenerator by calling updateEventGenerator
    // could also be moved to eventGeneratorAPI
    it('should create a reminder', function (done) {
        userTestUtil.generateAndSaveTestUser()
            .then(function (testUser) {
                const now = moment();
                eventGeneratorAPI
                    .createEventGenerator(testUser._id, mockEventGenerator(now))
                    .then(function (eventGenerator) {
                        reminderAPI.findReminderByEventGenerator(eventGenerator._id)
                            .then(function (reminders) {
                                expect(reminders.length).toBe(1);

                                const reminder = reminders[0],
                                    expectedReminderDate = moment(now).subtract(
                                        reminderUtil.SEND_REMINDER_DIFF, 'hour'
                                    );

                                expect(reminder._user.toString()).toBe(testUser._id.toString());

                                expect(
                                    reminder._eventGenerator.toString()
                                ).toBe(eventGenerator._id.toString());

                                expectDatesTheSameWithinEpsilon(
                                    reminder.date,
                                    expectedReminderDate,
                                    1
                                );
                                done()
                            })
                            .catch(done.fail)
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });

    // testing generateAndSaveRemindersFromEventGenerator by calling updateEventGenerator
    // could also be moved to eventGeneratorAPI
    it('should create a reminder and allow it to be updated', function (done) {
        userTestUtil.generateAndSaveTestUser()
            .then(function (testUser) {
                const now = moment();
                eventGeneratorAPI
                    .createEventGenerator(testUser._id, mockEventGenerator(now))
                    .then(function (eventGenerator) {
                        eventGenerator.date = moment(now).add(1, 'month').toDate();
                        eventGeneratorAPI.updateEventGenerator(eventGenerator._id, eventGenerator)
                            .then(function () {
                                reminderAPI.findReminderByEventGenerator(eventGenerator._id)
                                    .then(function (reminders) {
                                        expect(reminders.length).toBe(1);

                                        const reminder = reminders[0],
                                            expectedReminderDate = 
                                                moment(now)
                                                    .subtract(
                                                        reminderUtil._SEND_REMINDER_DIFF, 'hour'
                                                    )
                                                    .add(1, 'month');

                                        console.log('reminder', reminder);
                                        expect(
                                            reminder._user.toString()
                                        ).toBe(testUser._id.toString());

                                        console.log(moment(reminder.date), expectedReminderDate);
                                        expectDatesTheSameWithinEpsilon(
                                            reminder.date,
                                            expectedReminderDate,
                                            1
                                        );                                       
                                        done();
                                    })
                                    .catch(done.fail);
                            })
                            .catch(done.fail);
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });
});
