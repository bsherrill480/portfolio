const models = require('../../../../server/db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI,
    eventGeneratorConsts = require(
        '../../../../server/db/model/event_generator/event_generator_consts'
    ),
    userTestUtil = require('../../test_util/user_test_util'),
    moment = require('moment'),
    Promise = require('bluebird');

describe('event_generator_api updates nextEventDate', function () {
    it('should update on create', function (done) {
        userTestUtil.generateAndSaveTestUser()
            .then(function (user) {
                // doing second ago because we only expire events that are technically past.
                const secondAgo = moment().subtract(1, 'second'),
                    yesterday = moment(secondAgo).subtract(1, 'day'),
                    tomorrow = moment(secondAgo).add(1, 'day'),
                    twoDayFromNow = moment(secondAgo).add(2, 'day');
                const promises = [
                    eventGeneratorAPI.createEventGenerator(user._id, {
                        _user: user._id,
                        question: 'test question 1',
                        date: tomorrow,
                        intervalYear: 0,
                        intervalMonth: 0,
                        intervalDay: 1,
                        isReoccurring: true,
                        generatorType: eventGeneratorConsts.HOMEOWNER
                    }),
                    eventGeneratorAPI.createEventGenerator(user._id, {
                        _user: user._id,
                        question: 'test question 2',
                        date: twoDayFromNow,
                        intervalYear: 0,
                        intervalMonth: 0,
                        intervalDay: 1,
                        isReoccurring: true,
                        generatorType: eventGeneratorConsts.HOMEOWNER
                    }),
                    eventGeneratorAPI.createEventGenerator(user._id, {
                        _user: user._id,
                        question: 'test question 3',
                        date: yesterday,
                        intervalYear: 0,
                        intervalMonth: 0,
                        intervalDay: 1,
                        isReoccurring: false,
                        generatorType: eventGeneratorConsts.HOMEOWNER
                    }),
                    eventGeneratorAPI.createEventGenerator(user._id, {
                        _user: user._id,
                        question: 'test question 4',
                        date: secondAgo,
                        intervalYear: 0,
                        intervalMonth: 0,
                        intervalDay: 1,
                        isReoccurring: true,
                        generatorType: eventGeneratorConsts.HOMEOWNER
                    })
                ];
                Promise.all(promises)
                    .then(function (values) {
                        const eventGeneratorOne = values[0],
                            eventGeneratorTwo = values[1],
                            eventGeneratorThree = values[2],
                            eventGeneratorFour = values[3];
                        expect(
                            moment(eventGeneratorOne.nextEventDate).isSame(eventGeneratorOne.date)
                        ).toBeTruthy();
                        expect(
                            moment(eventGeneratorTwo.nextEventDate).isSame(eventGeneratorTwo.date)
                        ).toBeTruthy();
                        expect(
                            moment(eventGeneratorThree.nextEventDate)
                                .isSame(eventGeneratorThree.date)
                        ).toBeTruthy();
                        expect(
                            moment(eventGeneratorFour.nextEventDate)
                                .isSame(moment(secondAgo).add(1, 'day'))
                        ).toBeTruthy();
                        done();
                    })
                    .catch(done.fail)
            })
            .catch(done.fail);
    });
    
    // I Should have a test for update too, but they call the same function and I'm tired, sot
    // this will do for now.
});
