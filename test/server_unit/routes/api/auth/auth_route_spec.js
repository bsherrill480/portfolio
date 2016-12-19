const request = require('supertest'),
    app = require('../../../test_util/test_server_app'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    asyncUtil = require('../../../test_util/async_util'),
    userTestUtil = require('../../../test_util/user_test_util'),
    apiTestUtil = require('../api_test_util'),
    authRoute = '/api/auth/';

function expectUserToBeLoggedOut(request, done) {
    request
        .get(authRoute + 'userId')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function (res) {
            expect(res.body._id).toBe('');
        })
        .end(function (err) {
            if (err) {
                done.fail(err);
            } else {
                done();
            }
        });
}

describe('auth route userID route', function () {
    it('should send an empty if one is not logged in', function (done) {
        expectUserToBeLoggedOut(request(app), done);
        // request(app)
        //     .get(authRoute + 'userId')
        //     .set('Accept', 'application/json')
        //     .expect(200)
        //     .expect(function (res) {
        //         expect(res.body._id).toBe('');
        //     })
        //     .end(function (err) {
        //         if (err) {
        //             done.fail(err);
        //         } else {
        //             done();
        //         }
        //     });
    });

    it('should send a userId if one is logged in', function (done) {
        const agent = request.agent(app),
            u1 = userTestUtil.testUsers.u1;
        userTestUtil.loginAsTestUser(u1, agent)
            .then(function (user) {
                agent
                    .get(authRoute + 'userId')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body._id).toBe(user._id.toString());
                    })
                    .end(function (err) {
                        if (err) {
                            done.fail(err);
                        } else {
                            done();
                        }
                    });
            })
            .catch(done.fail);
    });
});

describe('auth route login', function () {
    it('should let you login if password is right', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        userAPI
            .createUser(generatedUser)
            .then(function () {
                request(app)
                    .post(authRoute + 'login')
                    .set('Accept', 'application/json')
                    .send({
                        username: generatedUser.email,
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

     it('should let not let you login if password is wrong', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        userAPI
            .createUser(generatedUser)
            .then(function () {
                request(app)
                    .post(authRoute + 'login')
                    .set('Accept', 'application/json')
                    .send({
                        username: generatedUser.email,
                        password: 'foobar'
                    })
                    .expect(401)
                    .expect(function (res) {
                        expect(res.body).toEqual({});
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

    it('should return a 400 if the request is invalid', function (done) {
        request(app)
            .post(authRoute + 'login')
            .set('Accept', 'application/json')
            .send({
                username: 'foobar'
            })
            .expect(400)
            .end(function (err) {
                if (err) {
                    done.fail(err);
                } else {
                    done();
                }
            });
    })
});

describe('auth route register', function () {
    it('should let users register', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        request(app)
            .post(authRoute + 'register')
            .set('Accept', 'application/json')
            .send({
                username: generatedUser.email,
                email: generatedUser.email,
                password: generatedUser.password
            })
            .expect(function (res) {
                apiTestUtil.expectedUserResponse(res.body, generatedUser);
            })
            .expect(200)
            .end(function (err) {
                if (err) {
                    done.fail(err);
                } else {
                    // check to see if the user exists
                    userAPI
                        .findUserByEmail(generatedUser.email)
                        .then(function (user) {
                            userTestUtil.expectUser(user, generatedUser, {
                                ignoreFacebook: true,
                                ignoreGoogle: true
                            });
                            done();
                        })
                        .catch(failIfErr);
                }
            });
    });

    it('should reject bad requests', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            generatedUser = userTestUtil.generateTestUser();
        request(app)
            .post(authRoute + 'register')
            .set('Accept', 'application/json')
            .send({
                username: generatedUser.email,
                email: generatedUser.email
            })
            .expect(function (res) {
                expect(res.body.error).toBe(apiTestUtil.badParams)
            })
            .expect(400)
            .end(function (err) {
                if (err) {
                    done.fail(err);
                } else {
                    // check to see if the user exists
                    userAPI
                        .findUserByEmail(generatedUser.email)
                        .then(function (user) {
                            expect(user).toBeFalsy();
                            done();
                        })
                        .catch(failIfErr);
                }
            });
    });
});

describe('auth route logout', function () {
    it('should let you logout', function (done) {
        const agent = request.agent(app),
            u1 = userTestUtil.testUsers.u1;
        console.log('request to:', authRoute + 'logout');
        userTestUtil.loginAsTestUser(u1, agent)
            .then(function () {
                agent
                    .post(authRoute + 'logout')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err) {
                        if (err) {
                            done.fail(err);
                        } else {
                           expectUserToBeLoggedOut(agent, done);
                        }
                    });
            })
            .catch(done.fail);
    });
});
