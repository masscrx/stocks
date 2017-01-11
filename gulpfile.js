var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var es = require('event-stream');
var del = require('del');
var browsersync = require('browser-sync');
var runSequence = require('run-sequence');
var merge          = require('merge-stream');
var cssnano        = require('gulp-cssnano');
var ngModuleSort = require('gulp-ng-module-sort');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jscs = require('gulp-jscs');

var bowerStreamJS = gulp.src(bowerFiles('**/*.js'));
var bowerStreamCSS = gulp.src(bowerFiles('**/*.css'));
var appStreamCSS = gulp.src(['./app/src/app.css']);
var appStreamJS = gulp.src([
  './src/app.module.js'
]);


var paths = {
  scripts: 'src/**/*.js',
  styles: './src/**/*.css',
  index: './src/index.html',
  partials: ['src/**/*.html'],
  fonts: ['./bower_components/font-awesome/fonts/**.*', './src/fonts/**.*', './bower_components/bootstrap/dist/fonts/**.*'],
  dest: {
    default: './app/',
    js: './app/**/*.js',
    vendors: './app/vendors.min.js'
  }
};

gulp.task('clean', function (cb) {
  return del([ 'app'], cb);
});

gulp.task('vendor-bundle', function () {
  return bowerStreamJS
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.default));
});

gulp.task('app-bundle', function () {
  return gulp.src(paths.scripts)
      .pipe(ngModuleSort())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(paths.dest.default));
});

gulp.task("styles", function () {

  var cssStream = gulp.src(paths.styles);
  var bowerStream = gulp.src(bowerFiles({ filter: '**/*.css' }));

  return merge(cssStream, bowerStream)
    .pipe(concat('style.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest(paths.dest.default));
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts)
      .pipe(gulp.dest(paths.dest.default + 'fonts'));
});

gulp.task('jscs', function() {
    gulp.src(paths.scripts)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('build-index', function() {
  return gulp
    .src(paths.index)
    .pipe(inject(gulp.src('./app/style.min.css'), {ignorePath: 'app'}))
    .pipe(inject(gulp.src([paths.dest.vendors, './app/app.js']), {ignorePath: 'app'}))
    .pipe(gulp.dest(paths.dest.default))
});

gulp.task('browserify', function () {
  return browserify('./src/js/app.module.js', {debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest(paths.dest.default));
  //.pipe(gulpPlugins.connect.reload());
});

gulp.task('build', function(callback) {
  runSequence('clean',
    //'styles',
    //'jshint',
    ['jscs', 'browserify', 'vendor-bundle', 'styles', 'fonts'],
    'build-index',
    callback);
});

gulp.task('browsersync', ['build'], function() {
  browsersync({
  server: {
    baseDir: [paths.dest.default]
  },
  port: 8000,
  files: [paths.scripts, paths.styles, paths.partials]   
 });
});

gulp.task('watch', ['browsersync'], function() {
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['jscs', 'browserify']);
  //gulp.watch(config.src.html, ['templates', 'copy-index-html']);
  //gulp.watch(config.images,  ['images']);
  //gulp.watch(config.svg,     ['copy:fonts']);
});

gulp.task('default', ['watch'], function () {
 
});


