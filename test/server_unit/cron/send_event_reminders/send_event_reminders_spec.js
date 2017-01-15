const models = require('../../../../server/db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI,
    eventGeneratorConsts = require(
        '../../../../server/db/model/event_generator/event_generator_consts'
    ),
    sendEventReminders = require('../../../../server/cron/send_event_reminders'),
    userTestUtil = require('../../test_util/user_test_util'),
    moment = require('moment'),
    Promise = require('bluebird'),
    mailer = require('../../../../server/mailer');

// describe('sendEventReminders', function () {
//     beforeEach(function () {
//         spyOn(mailer, 'sendEventReminderEmail');
//     });
//     it('should get be able to get eventGenerators and send emails', function (done) {
//         userTestUtil.generateAndSaveTestUser()
//             .then(function (user) {
//                 const now = moment(),
//                     yesterday = moment(now).subtract(1, 'day'),
//                     tomorrow = moment(now).add(1, 'day'),
//                     twoDayFromNow = moment(now).add(2, 'day');
//                 const promises = [
//                     eventGeneratorAPI.createEventGenerator(user._id, {
//                         _user: user._id,
//                         question: 'test question 1',
//                         date: tomorrow,
//                         intervalYear: 0,
//                         intervalMonth: 0,
//                         intervalDay: 1,
//                         isReoccurring: true,
//                         generatorType: eventGeneratorConsts.HOMEOWNER
//                     }),
//                     eventGeneratorAPI.createEventGenerator(user._id, {
//                         _user: user._id,
//                         question: 'test question 2',
//                         date: twoDayFromNow,
//                         intervalYear: 0,
//                         intervalMonth: 0,
//                         intervalDay: 1,
//                         isReoccurring: true,
//                         generatorType: eventGeneratorConsts.HOMEOWNER
//                     }),
//                     eventGeneratorAPI.createEventGenerator(user._id, {
//                         _user: user._id,
//                         question: 'test question 3',
//                         date: yesterday,
//                         intervalYear: 0,
//                         intervalMonth: 0,
//                         intervalDay: 1,
//                         isReoccurring: false,
//                         generatorType: eventGeneratorConsts.HOMEOWNER
//                     })
//                 ];
//                 Promise.all(promises)
//                     .then(function (values) {
//                         const eventGeneratorOne = values[0];
//                         expect(moment(eventGeneratorOne.nextEventDate).isSame(now)).toBeTruthy();
//                         sendEventReminders._getEventGeneratorsAndSetNextEventDates()
//                             .then(function (eventGenerators) {
//                                 expect(mailer.sendEventReminderEmail.calls.count()).toBe(1);
//                                
//                                 const eventGeneratorArg
//                                     = mailer.sendEventReminderEmail.calls.first().args[0];
//                                
//                                
//                                 expect(eventGeneratorArg._id.toString())
//                                     .toBe(eventGeneratorOne._id.toString());
//                               
//                                 console.log('old now', now.toString());
//                                 console.log('updatedEventGen nextReminderDate', moment(eventGenerators[0].nextReminderDate).toString());
//                                 done();
//                             })
//                             .catch(done.fail);
//                     })
//                     .catch(done.fail)
//             })
//             .catch(done.fail);
//     });
// });
