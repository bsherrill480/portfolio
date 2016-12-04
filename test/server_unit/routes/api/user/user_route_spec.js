const request = require('supertest'),
    app = require('../../../../../server/server_app'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    asyncUtil = require('../../../test_util/async_util'),
    userTestUtil = require('../../../test_util/user_test_util'),
    userRoute = '/api/user/';

function expectedUserResponse(user, target) {
    expect(user).toBeTruthy();
    expect(user.username).toBe(target.username);
    expect(user.password).toBeUndefined();
    expect(user.firstName).toBe(target.firstName);
    expect(user.lastName).toBe(target.lastName);
    expect(user.email).toBe(target.email);
    expect(user.facebook).toBeUndefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user._id).toBeDefined();
}

describe('user API route', function () {
    it('should get a user properly', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done);
        userTestUtil
            .generateAndSaveTestUser()
            .then(function (savedUser) {
                request(app)
                    .get(userRoute + savedUser._id)
                    .set('Accept', 'application/json')
                    // .expect('Content-Type', /json/)
                    // .expect(200)
                    .expect(function (res) {
                        expectedUserResponse(res.body, savedUser)
                    })
                    .end(function (err) {
                        if(err) {
                            done.fail(err);
                        } else {
                            done()
                        }
                    });
            })
            .catch(done.fail);
    });

    // should update a user, but not allow them to update password or facebook
    it('should update a user properly', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            changedUserAttrs = {
                username: 'bob',
                password: 'shouldNotChange',
                firstName: 'bill',
                lastName: 'bag',
                email: 'newEmail@email.com',
                facebook: {
                    id: 'foo',
                    token: 'bar'
                }
        };
        userTestUtil
            .generateAndSaveTestUser()
            .then(function (initUser) {
                request(app)
                    .put(userRoute + initUser._id)
                    .set('Accept', 'application/json')
                    .send(changedUserAttrs)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function (res) {
                        expectedUserResponse(res.body, changedUserAttrs);
                    })
                    .end(function (err) {
                        if(err) {
                            done.fail(err);
                        } else {
                            // done()
                            // check db really did update
                            userAPI
                                .findUserById(initUser._id)
                                .then(function (user) {
                                    expect(user.password).toBe(initUser.password);
                                    expect(user.facebook.id).toBe(initUser.facebook.id);
                                    expect(user.facebook.password).toBe(initUser.facebook.password);
                                    done()
                                })
                                .catch(failIfErr);
                        }
                    });
            })
            .catch(done.fail);
    });
});



// describe('request to non /api url', function () {
//     it('/ should responds with app html', function (done) {
//         expectRespondsWithAppHtml('/', done);
//     });
//     it('/foobar should responds with app html', function (done) {
//         expectRespondsWithAppHtml('/foobar', done);
//     });
// });
