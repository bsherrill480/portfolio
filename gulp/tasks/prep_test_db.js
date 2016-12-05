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

gulp.task('prep_test_db', function(cb) {
    let promises;
    console.log('gulp pret_test_db calling dbInit');
    dbInit(envs.TEST);
    promises = _.map(models, (model) => model.remove({}));
    Promise
        .all(promises)
        .then(function () {
            modelAPIs.userAPI
                .createUser(userTestUtil.testUsers.u1)
                .then(function (user) {
                    modelAPIs.pageAPI
                        .createPage(user._id, pageTestUtil.testPages.p1_u1)
                        .then(function () {
                            // mongoose is global but connections are created twice. I suspect a
                            // better solution would be to configure mongoose as an object instead
                            // of a global using conn=mongoose.createConnection.
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
