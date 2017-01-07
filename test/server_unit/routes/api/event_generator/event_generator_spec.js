const request = require('supertest'),
    app = require('../../../test_util/test_server_app'),
    eventGeneratorConsts =
        require('../../../../../server/db/model/event_generator/event_generator_consts'),
    models = require('../../../../../server/db/model/models'),
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

describe('event generator api update', function () {
    it('should allow a user to update an event generator', function (done) {
        const agent = request.agent(app),
            initialEventGenerator = eventGeneratorTestUtil.generateEventGenerator(),
            targetEventGenerator =
                eventGeneratorTestUtil.generateEventGenerator(eventGeneratorConsts.CAR_OWNER);
        let eventGeneratorId;
        userTestUtil
            .createAndLoginAsTestUser(agent)
            .then(function (user) {
                targetEventGenerator._user = user._id;
                models.eventGeneratorAPI
                    .createEventGenerator(user._id, initialEventGenerator)
                    .then(function (eventGenerator) {
                        agent
                            .put(eventGeneratorRoute + eventGenerator._id)
                            .set('Accept', 'application/json')
                            .send(targetEventGenerator)
                            .expect(200)
                            .expect(function (res) {
                                const returnedEventGenerator = res.body;
                                eventGeneratorTestUtil.expectEventGenerator(
                                    returnedEventGenerator,
                                    targetEventGenerator,
                                    {
                                        isServerResponse: true
                                    }
                                );
                                eventGeneratorId = returnedEventGenerator._id;
                            })
                            .end(function (err) {
                                if(err){
                                    done.fail(err);
                                } else {
                                    models.eventGeneratorAPI
                                        .findEventGeneratorById(eventGeneratorId)
                                        .then(function (eventGenerator) {
                                            eventGeneratorTestUtil.expectEventGenerator(
                                                eventGenerator,
                                                targetEventGenerator
                                            );
                                            done();
                                        })
                                        .catch(done.fail);
                                }
                            });
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });

    it('should fail if not logged in', function (done) {
        eventGeneratorTestUtil.getEventGeneratorsForTestUser(userTestUtil.testUsers.u1)
            .then(function (eventGenerators) {
                // we're using test user u1, who was set up with 1 event generator
                const eventGenerator = eventGenerators[0];
                apiTestUtil.expectFailsIfNotLoggedIn(
                    request(app).put(eventGeneratorRoute + eventGenerator._id.toString()),
                    done
                );
            })
            .catch(done.fail);
    });

     it('should fail if trying to edit someone else\'s', function (done) {
        eventGeneratorTestUtil.getEventGeneratorsForTestUser(userTestUtil.testUsers.u1)
            .then(function (eventGenerators) {
                // we're using test user u1, who was set up with 1 event generator
                const eventGenerator = eventGenerators[0],
                    agent = request.agent(app);
                userTestUtil.createAndLoginAsTestUser(agent)
                    .then(function () {
                        apiTestUtil.expectFailsIfNotOwner(
                            agent.put(eventGeneratorRoute + eventGenerator._id.toString()),
                            done
                        );                       
                    })
                    .catch(done.fail);
                
            })
            .catch(done.fail);
    });
});


describe('event generator api delete', function () {
    it('should allow a user to delete an event generator', function (done) {
        const agent = request.agent(app),
            initialEventGenerator = eventGeneratorTestUtil.generateEventGenerator();
        let eventGeneratorId;
        userTestUtil
            .createAndLoginAsTestUser(agent)
            .then(function (user) {
                models.eventGeneratorAPI
                    .createEventGenerator(user._id, initialEventGenerator)
                    .then(function (eventGenerator) {
                        eventGeneratorId = eventGenerator._id;
                        agent
                            .delete(eventGeneratorRoute + eventGeneratorId)
                            .set('Accept', 'application/json')
                            .expect(200)
                            .end(function (err) {
                                if(err){
                                    done.fail(err);
                                } else {
                                    models.eventGeneratorAPI
                                        .findEventGeneratorById(eventGeneratorId)
                                        .then(function (eventGenerator) {
                                            expect(eventGenerator).toBeFalsy();
                                            done();
                                        })
                                        .catch(done.fail);
                                }
                            });
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });

    it('should fail if not logged in', function (done) {
        eventGeneratorTestUtil.getEventGeneratorsForTestUser(userTestUtil.testUsers.u1)
            .then(function (eventGenerators) {
                // we're using test user u1, who was set up with 1 event generator
                const eventGenerator = eventGenerators[0];
                apiTestUtil.expectFailsIfNotLoggedIn(
                    request(app).delete(eventGeneratorRoute + eventGenerator._id.toString()),
                    done
                );
            })
            .catch(done.fail);
    });

     it('should fail if trying to delete someone else\'s', function (done) {
        eventGeneratorTestUtil.getEventGeneratorsForTestUser(userTestUtil.testUsers.u1)
            .then(function (eventGenerators) {
                // we're using test user u1, who was set up with 1 event generator
                const eventGenerator = eventGenerators[0],
                    agent = request.agent(app);
                userTestUtil.createAndLoginAsTestUser(agent)
                    .then(function () {
                        apiTestUtil.expectFailsIfNotOwner(
                            agent.delete(eventGeneratorRoute + eventGenerator._id.toString()),
                            done
                        );                       
                    })
                    .catch(done.fail);
                
            })
            .catch(done.fail);
    });
});
