import config from '../config';
import gulp   from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('eslint', () => {
  return gulp.src([config.scripts.src, '!app/js/templates.js', config.scripts.test, 
    config.scripts.gulp, config.scripts.server])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
