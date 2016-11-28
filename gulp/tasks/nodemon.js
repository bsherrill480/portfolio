/**
 * Created by brian on 11/23/16.
 */

import gulp from 'gulp';
import nodemon from 'gulp-nodemon'
import browserSync from 'browser-sync'
import config from '../config'

// Need to debug. Currently nodemon only notices a change once.
// Not sure if this is specific to my local machine. I've fiddled with the code below but it
// still exhibits that behavior.
gulp.task('nodemon', function (cb) {
  const script = config.server.file;
  let called = false;
  return nodemon({

    // nodemon our expressjs server
    script: script,

    // watch core server file(s) that require server restart on change
    watch: [script]
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, config.BROWSER_SYNC_RELOAD_DELAY);
    });
});
