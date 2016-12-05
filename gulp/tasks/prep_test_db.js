/**
 * Created by brian on 12/4/16.
 */
import dbInit from '../../server/db/initialize';
import User from '../../server/db/model/user/user_model';
import Page from '../../server/db/model/page/page_model';
import Widget from '../../server/db/model/widget/widget_model';
import modelAPIs from '../../server/db/model/models';
import envs from '../../server/config/envs';
import Promise from 'bluebird';
import gulp from 'gulp';
import _ from 'lodash';
import userTestUtil from '../../test/server_unit/test_util/user_test_util';
import pageTestUtil from '../../test/server_unit/test_util/page_test_util';
import mongoose from 'mongoose';

const models = [User, Page, Widget];

// This tasks cleans out all data in the test database and initialized mongoose test db connection
gulp.task('prep_test_db', function(cb) {
    let promises;
    dbInit(envs.TEST);
    promises = _.map(models, (model) => model.remove({}).exec());
    Promise
        .all(promises)
        .then(function () {
            modelAPIs.userAPI
                .createUser(userTestUtil.testUsers.u1)
                .then(function (user) {
                    modelAPIs.pageAPI
                        .createPage(user._id, pageTestUtil.testPages.p1U1)
                        .then(function () {
                            // mongoose is global, however when running dbInit here and during my
                            // tests, would cause it to run twice (despite it being a singleton).
                            // This caused two attempts to create a connection and would throw
                            // an error. Quick solution was to throw add to code that
                            // "if(!env.TEST)){dbInit()}" to server_app.js and add code below.
                            // I suspect a
                            // better solution might be to use mongoose as an object instead
                            // of a global, i.e. using conn=mongoose.createConnection and keep
                            // that as a singleton. This
                            // would work as long as we can have two connections to
                            // the same db. I chose not to do this because it would require more
                            // changes, and this app isn't intended to be production code. If
                            // this were production, the above change would probably be preferable.
                            //
                            // http://stackoverflow.com/questions/16138103/resetting-mongoose-model-cache
                            delete mongoose.models['User'];
                            delete mongoose.models['Page'];
                            delete mongoose.models['Widget'];
                            delete mongoose.modelSchemas['User'];
                            delete mongoose.modelSchemas['Page'];
                            delete mongoose.modelSchemas['Widget'];
                            cb();
                        });
                });
        });
});
