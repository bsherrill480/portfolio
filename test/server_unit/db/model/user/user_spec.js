const asyncUtil = require('../../../test_util/async_util'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    userTestUtil = require('../../../test_util/user_test_util'),
    generateTestUser = userTestUtil.generateTestUser;

describe('userAPI', function () {
    it('should create', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser = generateTestUser();
        userAPI
            .createUser(myTestUser)
            .then(function (createdUser) {
                userTestUtil.expectUser(createdUser, myTestUser);
                done();
            })
            .catch(failIfErr);
    });

    it('should find user by Id', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser = generateTestUser();
        userAPI
            .createUser(myTestUser)
            .then(function (user) {
                const myId = user._id;
                userAPI
                    .findUserById(myId)
                    .then(function (user) {
                        userTestUtil.expectUser(user, myTestUser);
                        expect(user._id.toString()).toBe(myId.toString());
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

    it('should find user by username', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser = generateTestUser();
        userAPI
            .createUser(myTestUser)
            .then(function () {
                userAPI
                    .findUserByEmail(myTestUser.username)
                    .then(function (user) {
                        userTestUtil.expectUser(user, myTestUser);
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

    it('should allow a user to be updated with password change', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser1 = generateTestUser(),
            myTestUser2 = generateTestUser(),
            myTestUser2Password = myTestUser2.password;
        userAPI
            .createUser(myTestUser1)
            .then(function (user) {
                const myId = user._id;
                userAPI
                    .updateUser(myId, myTestUser2) // also hashes new password
                    .then(function (user) {
                        myTestUser2.password = myTestUser2Password;
                        userTestUtil.expectUser(user, myTestUser2);
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

    it('should allow a user to be updated without password change', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser1 = generateTestUser(),
            myTestUser2 = generateTestUser(),
            myTestUser1Password = myTestUser1.password;
        delete myTestUser2.password;
        userAPI
            .createUser(myTestUser1)
            .then(function (user) {
                const myId = user._id;
                userAPI
                    .updateUser(myId, myTestUser2)
                    .then(function (user) {
                        myTestUser2.password = myTestUser1Password;
                        userTestUtil.expectUser(user, myTestUser2);
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

    it('show allow a user to be deleted', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser = generateTestUser();
        userAPI
            .createUser(myTestUser)
            .then(function (user) {
                const myId = user._id;
                userAPI
                    .deleteUser(myId)
                    .then(function () {
                        userAPI
                            .findUserById(myId)
                            .then(function (user) {
                                expect(user).toBeFalsy();
                                done();
                            })
                            .catch(failIfErr);
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });
});

