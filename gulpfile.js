/* plugins */
var gulp = require('gulp');
var browsersync = require('browser-sync').create();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');



/* browser sync */
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
}

function browserReload(done) {
  browsersync.reload();
  done();
}


/* scripts */
function scripts () {
  return gulp
    .src(['js/*.js', '!js/oldVersion.js'])
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./scripts/'))
    .pipe(browsersync.stream());
}

/* styles */
function scss () {
  return gulp
    .src(['./scss/*.scss'])
    .pipe(concat('style.css'))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./styles/'))
    .pipe(browsersync.stream());
}



/* watch */
function watchFiles () {
  gulp.watch('./scss/*', scss);
  gulp.watch('./js/*', scripts);
  gulp.watch('./*.html', browserReload);
}


gulp.task('watch', gulp.parallel(watchFiles, browserSync));
gulp.task('build', gulp.series(scss, scripts));
