import config from '../config';
import gulp from 'gulp';
import fs from 'fs'
import _ from 'lodash';
import path from 'path';
import ncp from 'ncp';
import Bluebird from 'bluebird';
import zipFolder from 'zip-folder';
import cmd from 'node-cmd';

// http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());

//cmd callback does not follow the convention function(err, result), just function(result)
//so had to custom make instead of using Bluebird.promisify.
function cmdGetAsync(command) {
    return new Bluebird(function (resolve) {
        cmd.get(command, function (result) {
            resolve(result);
        })
    })
}

gulp.task('prep_lambdas', function(done) {

    const cpDirAsync = Bluebird.promisify(ncp.ncp),
        zipDirAsync = Bluebird.promisify(zipFolder),
        lambdaDirs = getDirs(config.lambdas.path),
        cpDirPromises = [],
        installNodeModulesPromises = [],
        zipPromises = [];

    _.each(lambdaDirs, function (lambdaDirName) {
        const lambdaPath = path.join(config.lambdas.path, lambdaDirName),
            lambdaServerPath = path.join(lambdaPath, 'server');

        // make server dir if it doesn't exist
        if(!fs.existsSync(lambdaServerPath)) {
            fs.mkdirSync(lambdaServerPath);
        }

        //copy package.json into lambda dir
        fs.createReadStream('package.json')
            .pipe(fs.createWriteStream(path.join(lambdaPath, 'package.json')));

        // copy server into lambda dir, then
        const cpDirPromise = cpDirAsync(config.server.path, lambdaServerPath);
        cpDirPromises.push(cpDirPromise);
        cpDirPromise
            .then(function () {
                // We could improve performance by just doing this once, and then copying it
                // but this keeps the code simpler
                const installNodeModulesPromise = cmdGetAsync(
                    `npm install --prefix ${lambdaPath} --production`
                );
                installNodeModulesPromises.push(installNodeModulesPromise);
                installNodeModulesPromise.then(function () {
                    const zipFile = path.join(config.lambdas.path, lambdaDirName + '.zip'),
                        zipPromise = zipDirAsync(lambdaPath, zipFile);
                    zipPromises.push(zipPromise);                   
                });
            });

    });


    //setup promises
    Bluebird.all(cpDirPromises)
        .then(function () {
            Bluebird.all(installNodeModulesPromises)
                .then(function () {
                    Bluebird.all(zipPromises)
                        .then(() => done())
                        .catch(function (err) {
                            console.log('zipPromises error', err);
                            done(err);
                        });                   
                })
                .catch(function (err) {
                    console.log('installNodeModules error', err);
                    done(err);
                });
        })
        .catch(function (err) {
            console.log('cpDirPromises error', err);
            done(err);
        });
});
