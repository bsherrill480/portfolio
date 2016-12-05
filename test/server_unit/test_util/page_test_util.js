const Promise = require('bluebird'),
    models = require('../../../server/db/model/models'),
    Page = require('../../../server/db/model/page/page_model'),
    userTestUtil = require('./user_test_util'),
    _ = require('lodash'),
    pageAPI = models.pageAPI,
    userAPI = models.userAPI,
    testUsers = userTestUtil.testUsers;

module.exports = {
    // all objects below should have unique title
    testPages: {
        // page 1 owned by u1
        p1U1: {
            title: 'a',

            // object only on testPages.*
            _meta: {
                user: testUsers.u1
            }
        },

        getId: function (testPage) {
            return new Promise(function(resolve, reject) {
                testUsers
                    .getTestUserId(testPage._meta.user)
                    .then(function (user) {
                        pageAPI
                            .findAllPagesForUser(user._id)
                            .then(function (pages) {
                                const page = _.find(pages, (page) => page.title === testPage.title);
                                if(page) {
                                    resolve(page)
                                } else {
                                    reject(new Error('Test page not found!'))
                                }
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
        }
    },
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

