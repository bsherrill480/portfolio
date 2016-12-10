import config       from '../config';
import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import sourcemaps   from 'gulp-sourcemaps';
import sass         from 'gulp-sass';
import sassGlob     from 'gulp-sass-glob';
import handleErrors from '../util/handleErrors';
import browserSync  from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import sassLint     from 'gulp-sass-lint';

gulp.task('sass-lint', function () {
  return gulp.src([config.styles.srcAll, config.styles.ignore])
    .pipe(sassLint({
        rules: {
            'class-name-format': 0, // It doesnt like my BEM conventions
            'placeholder-name-format': 0, // It doesnt like my BEM conventions
            'indentation': [1, {
                size: 4
            }]
            
        }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('styles', ['sass-lint'], function () {

  const createSourcemap = !global.isProd || config.styles.prodSourcemap;

  return gulp.src(config.styles.src)
    .pipe(gulpif(createSourcemap, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass({
      sourceComments: !global.isProd,
      outputStyle: global.isProd ? 'compressed' : 'nested',
      includePaths: config.styles.sassIncludePaths,
      precision: 8 // needed for bootstrap
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 8']
    }))
    .pipe(gulpif(
      createSourcemap,
      sourcemaps.write( global.isProd ? './' : null ))
    )
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream());

});
