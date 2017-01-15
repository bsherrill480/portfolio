const models = require('../../../../server/db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI,
    reminderAPI = models.reminderAPI,
    eventGeneratorConsts = require(
        '../../../../server/db/model/event_generator/event_generator_consts'
    ),
    reminderConsts = require(
        '../../../../server/db/model/reminder/reminder_consts'
    ),
    sendEventReminders = require('../../../../server/cron/send_event_reminders'),
    userTestUtil = require('../../test_util/user_test_util'),
    moment = require('moment'),
    Promise = require('bluebird'),
    mailer = require('../../../../server/mailer');

describe('sendEventReminders', function () {
    beforeEach(function () {
        spyOn(mailer, 'sendEventReminderEmail');
    });
    it('should get be able send reminders', function (done) {
        userTestUtil.generateAndSaveTestUser()
            .then(function (user) {
                const now = moment().subtract(1, 'second'),
                    inFuture = moment(now).add(1, 'hours'),
                    olderThanReminderSearches = moment(now).subtract(2, 'hours');

                eventGeneratorAPI
                    .createEventGenerator(user._id, {
                        question: 'foo',
                        date: moment(now).add(1, 'year'),
                        intervalYear: 0,
                        intervalMonth: 0,
                        intervalDay: 1,
                        isReoccurring: true,
                        generatorType: eventGeneratorConsts.HOMEOWNER
                    })
                    .then(function (eventGenerator) {
                        const promises = [
                            reminderAPI.createReminder({
                                _user: user._id,
                                _eventGenerator: eventGenerator._id,
                                date: now.toDate(),
                                type: reminderConsts.EMAIL
                            }),
                            reminderAPI.createReminder({
                                _user: user._id,
                                _eventGenerator: eventGenerator._id,
                                date: inFuture.toDate(),
                                type: reminderConsts.EMAIL
                            }),
                            reminderAPI.createReminder({
                                _user: user._id,
                                _eventGenerator: eventGenerator._id,
                                date: olderThanReminderSearches.toDate(),
                                type: reminderConsts.EMAIL
                            })
                        ];
                        Promise.all(promises)
                            .then(function (values) {
                                const reminderThatShouldGetSelected = values[0];
                                sendEventReminders._sendRemindersJob()
                                    .then(function () {
                                        expect(mailer.sendEventReminderEmail.calls.count()).toBe(1);
                                        const mailerArg
                                            = mailer.sendEventReminderEmail.calls.first().args[0];


                                        expect(
                                            mailerArg._id.toString()
                                        ).toBe(reminderThatShouldGetSelected._id.toString());
                                        done();
                                    })
                                    .catch(done.fail);
                            })
                            .catch(done.fail)
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });
});
