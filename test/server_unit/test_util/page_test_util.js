const Promise = require('bluebird'),
    models = require('../../../server/db/model/models'),
    Page = require('../../../server/db/model/page/page_model'),
    userTestUtil = require('./user_test_util'),
    pageAPI = models.pageAPI,
    userAPI = models.userAPI;

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

