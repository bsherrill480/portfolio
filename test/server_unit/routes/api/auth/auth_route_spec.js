/**
 * Created by brian on 12/4/16.
 */
const request = require('supertest'),
    app = require('../../../../../server/server_app'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    asyncUtil = require('../../../test_util/async_util'),
    userTestUtil = require('../../../test_util/user_test_util'),
    apiTestUtil = require('../api_test_util'),
    authRoute = '/api/auth/';

describe('auth route userID route', function () {
    it('should send an empty if one is not logged in', function (done) {
        request(app)
            .get(authRoute + 'userId')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(function (res) {
                expect(res.body.userId).toBe('');
            })
            .end(function (err) {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    });

     it('should send an userId if one is logged in', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        userAPI
            .createUser(generatedUser)
            .then(function (savedGeneratedUser) {
                const agent = request.agent(app);
                agent
                    .post(authRoute + 'login')
                    .set('Accept', 'application/json')
                    .send({
                        username: generatedUser.username,
                        password: generatedUser.password
                    })
                    .expect(200)
                    .expect(function (res) {
                        apiTestUtil.expectedUserResponse(res.body, generatedUser);
                    })
                    .end(function (err) {
                        if (err) {
                            done.fail(err);
                        } else {
                            agent
                                .get(authRoute + 'userId')
                                .set('Accept', 'application/json')
                                .expect(200)
                                .expect(function (res) {
                                    expect(res.body.userId).toBe(savedGeneratedUser._id.toString());
                                })
                                .end(function (err) {
                                    if (err) {
                                        done.fail(err);
                                    } else {
                                        done();
                                    }
                                });
                        }
                    });
            })
            .catch(failIfErr);
     });
});

describe('auth route login', function () {
    it('should let you login', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        userAPI
            .createUser(generatedUser)
            .then(function () {
                request(app)
                    .post(authRoute + 'login')
                    .set('Accept', 'application/json')
                    .send({
                        username: generatedUser.username,
                        password: generatedUser.password
                    })
                    .expect(200)
                    .expect(function (res) {
                        apiTestUtil.expectedUserResponse(res.body, generatedUser);
                    })
                    .end(function (err) {
                        if (err) {
                            done.fail(err);
                        } else {
                            done();
                        }
                    });
            })
            .catch(failIfErr);
    });
});

describe('auth route register', function () {
    it('should let users register', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        request(app)
            .post(authRoute + 'register')
            .set('Accept', 'application/json')
            .send({
                username: generatedUser.username,
                password: generatedUser.password,
                firstName: generatedUser.firstName,
                lastName: generatedUser.lastName,
                email: generatedUser.email
            })
            .expect(200)
            .expect(function (res) {
                apiTestUtil.expectedUserResponse(res.body, generatedUser);
            })
            .end(function (err) {
                if (err) {
                    done.fail(err);
                } else {
                    // check to see if the user exists
                    userAPI
                        .findUserByUsername(generatedUser.username)
                        .then(function (user) {
                            userTestUtil.expectUser(user, generatedUser, {ignoreFacebook: true});
                            done();
                        })
                        .catch(failIfErr);
                }
            });
    });
});

