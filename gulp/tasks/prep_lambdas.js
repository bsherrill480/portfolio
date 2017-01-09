import config from '../config';
import gulp from 'gulp';
import fs from 'fs'
import _ from 'lodash';
import path from 'path';
import ncp from 'ncp';
import bluebird from 'bluebird'
import zipFolder from 'zip-folder'

gulp.task('prep_lambdas', function(done) {
    // http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
    const cpDirAsync = bluebird.promisify(ncp.ncp),
        zipDirAsync = bluebird.promisify(zipFolder),
        getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory()),
        lambdaDirs = getDirs(config.lambdas.path),
        cpDirPromises = [],
        zipPromises = [];

    // console.log(lambdaDirs);
    _.each(lambdaDirs, function (lambdaDir) {
        const lambdaServerDir = path.join(config.lambdas.path, lambdaDir, 'server');
        if(!fs.existsSync(lambdaServerDir)) {
            fs.mkdirSync(lambdaServerDir);
        }
        const cpDirPromise = cpDirAsync(config.server.path, lambdaServerDir)
            .then(function () {
                const zipFile = path.join(config.lambdas.path, lambdaDir + '.zip'),
                    toZipFolder = path.join(config.lambdas.path, lambdaDir);
                zipPromises.push(zipDirAsync(toZipFolder, zipFile));
            })
            .catch(function (err) {
                console.log('prep_lambdas cpDirAsync had err', err);
                throw err;
            });
        cpDirPromises.push(cpDirPromise);
    });

    bluebird.all(cpDirPromises)
        .then(function () {
            bluebird.all(zipPromises)
                .then(() => done())
                .catch(done);
        })
        .catch(done);
});
