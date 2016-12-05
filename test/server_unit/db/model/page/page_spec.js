const models = require('../../../../../server/db/model/models'),
    pageAPI = models.pageAPI,
    pageTestUtil = require('../../../test_util/page_test_util'),
    saveTestPageAddUser = pageTestUtil.saveTestPageAddUser,
    asyncUtil = require('../../../test_util/async_util');

function expectPage(page, target) {
    expect(page).toBeTruthy();
    expect(page.title).toBe(target.title);
    expect(page._user).toBeDefined();
    expect(page.updatedAt).toBeDefined();
    expect(page.createdAt).toBeDefined();
    expect(page._id).toBeDefined();
}

describe('pageAPI', function () {

    it('should create', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            targetPage = {title: 'test'};
        saveTestPageAddUser(targetPage)
            .then(function (testPage) {
                expectPage(testPage, targetPage);
                done();
            })
            .catch(failIfErr);
    });

    it('should find all pages for user', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            targetPage = {title: 'test'};
        saveTestPageAddUser(targetPage)
            .then(function (testPage) {
                const myUser = testPage._user;
                pageAPI
                    .findAllPagesForUser(testPage._user)
                    .then(function (testPages) {
                        const testPage = testPages[0];
                        expect(testPages.length).toBe(1);
                        expectPage(testPage, targetPage);
                        expect(testPage._user.toString()).toBe(myUser.toString());
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

    it('should find page by id', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            targetPage = {title: 'test'};
        saveTestPageAddUser(targetPage)
            .then(function (testPage) {
                const myId = testPage._id;
                pageAPI
                    .findPageById(myId)
                    .then(function (testPage) {
                        expectPage(testPage, targetPage);
                        expect(testPage._id.toString()).toBe(myId.toString());
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
    });

     it('should allow a page to be updated', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            targetPage1 = {title: 'test1'},
            targetPage2 = {title: 'test2'};
        saveTestPageAddUser(targetPage1)
            .then(function (testPage1) {
                const myId = testPage1._id;
                pageAPI
                    .updatePage(myId, targetPage2)
                    .then(function (testPage) {
                        expectPage(testPage, targetPage2);
                        expect(testPage._id.toString()).toBe(myId.toString());
                        done();
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);
     });
    
    it('should allow a page to be deleted', function (done) {
        const failIfErr = asyncUtil.getFailIfErrCallback(done),
            targetPage = {title: 'test'};
        saveTestPageAddUser(targetPage)
            .then(function (testPage) {
                const myId = testPage._id;
                pageAPI
                    .deletePage(myId)
                    .then(function () {
                        pageAPI
                            .findPageById(myId)
                            .then(function (page) {
                                expect(page).toBeFalsy();
                                done();
                            })
                            .catch(failIfErr);
                    })
                    .catch(failIfErr);
            })
            .catch(failIfErr);       
    });
});

