const dbUtil = require('../../../test_util/db_util'),
    asyncUtil = require('../../../test_util/async_util'),
    models = require('../../../../../server/db/model/models'),
    userAPI = models.userAPI,
    userTestUtil = require('../../../test_util/user_test_util'),
    generateTestUser = userTestUtil.generateTestUser;

function cleanUpAsync(done) {
    userTestUtil
        .cleanUpAsyncUsers()
        .then(done)
        .catch(done.fail);
}

function expectUser(user, target) {
    expect(user).toBeTruthy();
    expect(user.username).toBe(target.username);
    expect(user.isValidPassword(target.password)).toBeTruthy();
    expect(user.isValidPassword('foobar')).toBeFalsy();
    expect(user.firstName).toBe(target.firstName);
    expect(user.lastName).toBe(target.lastName);
    expect(user.email).toBe(target.email);
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user._id).toBeDefined();
    expect(user.facebook.id).toBe(target.facebook.id);
    expect(user.facebook.token).toBe(target.facebook.token);
    // expect(_.get(user, 'facebook.id')).toBe(_.get(user, 'facebook.id'));
    // expect(_.get(user, 'facebook.token')).toBe(_.get(user, 'facebook.token'));
}

dbUtil.initialize();

describe('userAPI', function () {
    beforeAll(cleanUpAsync);
    afterAll(cleanUpAsync);

    it('should create', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            myTestUser = generateTestUser();
        userAPI
            .createUser(myTestUser)
            .then(function (createdUser) {
                expectUser(createdUser, myTestUser);
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
                        expectUser(user, myTestUser);
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
                    .findUserByUsername(myTestUser.username)
                    .then(function (user) {
                        expectUser(user, myTestUser);
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
                        expectUser(user, myTestUser2);
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
                        expectUser(user, myTestUser2);
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

