import config from '../config';
import gulp from 'gulp';
import fs from 'fs'
import _ from 'lodash';
import path from 'path';

gulp.task('prep_lambdas', function() {
    // http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
    const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory()),
        lambdaDirs = getDirs(config.lambdas.path);

    // console.log(lambdaDirs);
    _.each(lambdaDirs, function (lambdaDir) {
        const p = path.join(config.lambdas.path, lambdaDir);
        
    });

});
