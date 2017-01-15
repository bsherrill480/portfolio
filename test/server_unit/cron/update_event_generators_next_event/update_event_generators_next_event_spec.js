const models = require('../../../../server/db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI,
    eventGeneratorConsts = require(
        '../../../../server/db/model/event_generator/event_generator_consts'
    ),
    cronUpdateEventGenerators
        = require('../../../../server/cron/update_event_generators_next_event'),
    userTestUtil = require('../../test_util/user_test_util'),
    moment = require('moment'),
    Promise = require('bluebird');

describe('update event generators next event spec', function () {
    it('should get recently expired eventGenerators and update eventdate', function (done) {
        userTestUtil.generateAndSaveTestUser()
            .then(function (user) {
                // doing second in future so that API won't update it before it saves
                // and waiting 1.1 seconds so it will have expired.
                const futureSecond = moment().add(1, 'second');
                const onePointOneSecondInMs = 1100,
                    createEventGeneratorExpiresInSecond = eventGeneratorAPI.createEventGenerator(
                        user._id,
                        {
                            _user: user._id,
                            question: 'test question 4',
                            date: futureSecond,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 1,
                            isReoccurring: true,
                            generatorType: eventGeneratorConsts.HOMEOWNER
                        }
                    );

                setTimeout(function () {
                    createEventGeneratorExpiresInSecond
                        .then(function (eventGenerator) {
                            const expectedNextEventDate = moment(futureSecond).add(1, 'day');
                            cronUpdateEventGenerators._getEventGeneratorsAndSetNextEventDates()
                                .then(function (savedEventGenerators) {
                                    const updatedEventGenerator = savedEventGenerators[0];
                                    expect(updatedEventGenerator._id.toString())
                                        .toBe(eventGenerator._id.toString());
                                    expect(
                                        moment(updatedEventGenerator.nextEventDate)
                                            .isSame(expectedNextEventDate)
                                    ).toBeTruthy();
                                    done();
                                })
                                .catch(done.fail)
                        })
                        .catch(done.fail);
                }, onePointOneSecondInMs);
            })
            .catch(done.fail);
    });
});
