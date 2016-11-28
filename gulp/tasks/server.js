/**
 * Created by brian on 11/23/16.
 */

import gulp from 'gulp';
import server from 'gulp-express'
// import browserSync from 'browser-sync'
import config from '../config'

function runServer() {
  server.run([config.server.file]);
}

function serverRestart() {
  console.log('restarting server');
  server.stop();
  runServer();
}

// Need to debug. Currently nodemon only notices a change once.
// Not sure if this is specific to my local machine. I've fiddled with the code below but it
// still exhibits that behavior.
gulp.task('server', function (cb) {
  let called = false;
  runServer();
  gulp.watch([config.scripts.server], serverRestart); // Assuming start synch
  if(!called) {
    // let server setup before calling cb
    setTimeout(function () { // not a good way, but for development purposes, it'll do.
      cb();
    }, 300);
    called = true;
  }
  // const script = config.server.file;
  // let called = false;
  // return nodemon({
  //
  //   // nodemon our expressjs server
  //   script: script,
  //
  //   // watch core server file(s) that require server restart on change
  //   watch: [script]
  // })
  //   .on('start', function onStart() {
  //     // ensure start only got called once
  //     if (!called) { cb(); }
  //     called = true;
  //   })
  //   .on('restart', function onRestart() {
  //     // reload connected browsers after a slight delay
  //     setTimeout(function reload() {
  //       browserSync.reload({
  //         stream: false
  //       });
  //     }, config.BROWSER_SYNC_RELOAD_DELAY);
  //   });
});
