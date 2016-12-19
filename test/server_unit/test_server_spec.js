/**
 * Created by brian on 12/4/16.
 */
const models = require('../../server/db/model/models'),
    userTestUtil = require('./test_util/user_test_util'),
    asyncUtil = require('./test_util/async_util');


describe('test db', function () {
    it('should have user u1', function (done) {
        const u1 = userTestUtil.testUsers.u1,
            failIfErr = asyncUtil.getFailIfErrCallback(done);
        userTestUtil.testUsers
            .getTestUserId(u1)
            .then(function (user) {
                userTestUtil.expectUser(user, u1);
            })
            .catch(failIfErr);
    });
});
