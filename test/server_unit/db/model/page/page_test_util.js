const Promise = require('bluebird'),
    dbUtil = require('../../../test_util/db_util'),
    models = require('../../../../../server/db/model/models'),
    Page = require('../../../../../server/db/model/page/page_model'),
    userTestUtil = require('../user/user_test_util'),
    pageAPI = models.pageAPI,
    userAPI = models.userAPI;

let defaultPageOwner = null;

module.exports = {
    cleanUpAsyncPages() {
        return Promise.all([userTestUtil.cleanUpAsyncUsers, Page.remove({}).exec()]);
    },
    
    saveTestPageAddUser: function (testPage) {
        const myUser = userTestUtil.generateTestUser();
        return new Promise(function (resolve, reject) {
            userAPI
                .createUser(myUser)
                .then(function (user) {
                    // testPage._user = user._id;
                    pageAPI
                        .createPage(user._id, testPage)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
};

