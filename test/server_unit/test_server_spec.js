const userTestUtil = require('./test_util/user_test_util'),
    eventGeneratorTestUtil = require('./test_util/event_generator_test_util'),
    asyncUtil = require('./test_util/async_util'),
    modelAPIs = require('../../server/db/model/models'),
    _ = require('lodash');


describe('test db', function () {
    it('should have user u1', function (done) {
        const u1 = userTestUtil.testUsers.u1,
            ev1Cpy = _.extend({}, eventGeneratorTestUtil.testEventGenerators.eg1),
            failIfErr = asyncUtil.getFailIfErrCallback(done);
        userTestUtil.testUsers
            .getTestUserId(u1)
            .then(function (user) {
                userTestUtil.expectUser(user, u1);
                modelAPIs.eventGeneratorAPI
                    .findAllEventGeneratorsForUser(user._id)
                    .then(function (eventGenerators) {
                        // we only put 1 event generator in, so we should get 1 back
                        expect(eventGenerators.length).toBe(1);
                        const eventGenerator = eventGenerators[0];
                        ev1Cpy._user = user._id;
                        eventGeneratorTestUtil.expectEventGenerator(eventGenerator, ev1Cpy);
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });
});
