import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('test', function() {

  return runSequence('app_unit', 'server_unit', 'protractor');

});
