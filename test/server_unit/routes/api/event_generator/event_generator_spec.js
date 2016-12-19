const request = require('supertest'),
    app = require('../../../test_util/test_server_app'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    asyncUtil = require('../../../test_util/async_util'),
    userTestUtil = require('../../../test_util/user_test_util'),
    eventGeneratorTestUtil = require('../../../test_util/event_generator_test_util'),
    apiTestUtil = require('../api_test_util'),
    eventGeneratorRoute = '/api/event_generator/',
    _ = require('lodash');


describe('Event Generator get all event generators for user', function () {
    it('should return all event generators for user', function (done) {
        const agent = request.agent(app),
            expectedEventGenerator = _.extend({}, eventGeneratorTestUtil.testEventGenerators.eg1);
        userTestUtil.loginAsTestUser(userTestUtil.testUsers.u1, agent)
            .then(function (user) {
                expectedEventGenerator._user = user._id;
                agent
                    .get(eventGeneratorRoute)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect(function (res) {
                        const eventGenerators = res.body;
                        expect(eventGenerators).toEqual(jasmine.any(Array));
                        eventGeneratorTestUtil.expectEventGenerator(
                            eventGenerators[0],
                            expectedEventGenerator,
                            {
                                isServerResponse: true
                            }
                        );
                    })
                    .end(apiTestUtil.errIfErrElseDone(done));
            })
            .catch(done.fail);
    });

    it('should fail if not logged in', function (done) {
        apiTestUtil.expectFailsIfNotLoggedIn(
            request(app).get(eventGeneratorRoute),
            done
        );
    });
});

describe('Event Generator create new event generator', function () {
    it('should create a event generator for a user', function (done) {
        const agent = request.agent(app),
            expectedEventGenerator = eventGeneratorTestUtil.generateEventGenerator();
        let eventGeneratorId;
        userTestUtil.createAndLoginAsTestUser(agent)
            .then(function (user) {
                expectedEventGenerator._user = user._id;
                console.log('sending request to make eventGenerator');
                agent
                    .post(eventGeneratorRoute)
                    .set('Accept', 'application/json')
                    .send(expectedEventGenerator)
                    .expect(200)
                    .expect(function (res) {
                        const eventGenerator = res.body;
                        eventGeneratorTestUtil.expectEventGenerator(
                            eventGenerator,
                            expectedEventGenerator,
                            {
                                isServerResponse: true
                            }
                        );
                        eventGeneratorId = eventGenerator._id;
                    })
                    .end(function (err) {
                        if(err) {
                            done.fail(err)
                        } else {
                            models.eventGeneratorAPI
                                .findEventGeneratorById(eventGeneratorId)
                                .then(function (eventGenerator) {
                                    expect(eventGenerator).toBeTruthy();
                                    done();
                                })
                                .catch(done.fail)
                        }
                    });
            })
            .catch(done.fail);
    });

    it('should fail if not logged in', function (done) {
        apiTestUtil.expectFailsIfNotLoggedIn(
            request(app).post(eventGeneratorRoute),
            done
        );
    });
});

