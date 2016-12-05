/**
 * Created by brian on 12/4/16.
 */
const models = require('../../server/db/model/models'),
    userTestUtil = require('./test_util/user_test_util'),
    pageTestUtil = require('./test_util/page_test_util'),
    asyncUtil = require('./test_util/async_util');


describe('test db', function () {
    it('user u1 and his pages', function (done) {
        const u1 = userTestUtil.testUsers.u1,
            p1U1 = pageTestUtil.testPages.p1U1,
            failIfErr = asyncUtil.getFailIfErrCallback(done);
        userTestUtil.testUsers
            .getTestUserId(u1)
            .then(function (user) {
                userTestUtil.expectUser(user, u1);
                models.pageAPI
                    .findAllPagesForUser(user._id)
                    .then(function (pages) {
                        const page = pages[0];
                        expect(page).toBeTruthy();
                        expect(page.title).toBe(p1U1.title);
                        expect(page._user.toString()).toBe(user._id.toString());
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });
});
