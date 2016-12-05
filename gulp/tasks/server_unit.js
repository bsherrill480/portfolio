import config    from '../config';
import gulp      from 'gulp';
import jasmine   from 'gulp-jasmine';
import istanbul  from 'gulp-istanbul';

gulp.task('pre_test', function () {
  return gulp.src(config.server.files)
    // Covering files
    .pipe(istanbul())
    // Write the covered files to a temporary directory
    .pipe(istanbul.hookRequire());
});

gulp.task('server_unit', ['prep_test_db', 'pre_test'], function(cb) {
  gulp.src(config.server.tests)
  // gulp-jasmine works on filepaths so you can't have any plugins before it
    .pipe(jasmine())
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb();
    });
});



// gulp.task('pre-test', function () {
//   return gulp.src(config.server.files)
//     // Covering files
//     .pipe(istanbul())
//     // Write the covered files to a temporary directory
//     .pipe(gulp.dest(config.server.testTemp));
// });
//
// gulp.task('server_unit', ['pre-test'], function(cb) {
//   // Make sure your tests files are requiring files from the
//   // test-tmp/ directory
//   gulp.src(config.server.tests)
//   // gulp-jasmine works on filepaths so you can't have any plugins before it
//     .pipe(jasmine())
//     .pipe(istanbul.writeReports())
//     .on('end', function () {
//       cb();
//     });
// });


