var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var browsersync = require('browser-sync');
var runSequence = require('run-sequence');
var merge          = require('merge-stream');
var cssnano        = require('gulp-cssnano');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jscs = require('gulp-jscs');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml    = require('gulp-minify-html');

var paths = {
  appMain: './src/js/app.module.js',
  scripts: 'src/**/*.js',
  styles: './src/**/*.css',
  index: './src/index.html',
  partials: ['src/js/**/*.html'],
  fonts: [
    './bower_components/font-awesome/fonts/**.*',
    './src/fonts/**.*',
    './bower_components/bootstrap/dist/fonts/**.*'
  ],
  dest: {
    default: './app/',
    js: './app/**/*.js',
    vendors: './app/vendors.min.js',
    app: './app/app.js',
    styles: './app/style.min.css',
    partials: './app/partials.js'
  }
};

gulp.task('clean', function (cb) {
  return del(['app'], cb);
});

gulp.task('vendor-bundle', function () {
  return gulp.src(bowerFiles('**/*.js'))
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.default));
});

// gulp.task('app-bundle', function () {
//  return gulp.src(paths.scripts)
//      .pipe(ngModuleSort())
//      .pipe(concat('app.js'))
//      .pipe(gulp.dest(paths.dest.default));
//});

gulp.task('styles', function () {

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
    .pipe(inject(gulp.src(paths.dest.styles), { ignorePath: 'app' }))
    .pipe(inject(gulp.src([paths.dest.vendors, paths.dest.partials, paths.dest.app]), { ignorePath: 'app' }))
    .pipe(gulp.dest(paths.dest.default));
});

gulp.task('browserify', function () {
  return browserify(paths.appMain, { debug: true })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest(paths.dest.default));
});



gulp.task('partials', function() {
  return gulp.src(paths.partials)
    // .pipe(minifyHtml({
    //   empty: true,
    //   spare: true,
    //   quotes: true
    // }))
    .pipe(templateCache({
      module: 'app.partials',
      standalone: true
    }))
    .pipe(concat('partials.js'))
    .pipe(gulp.dest(paths.dest.default));
});

gulp.task('build', function(callback) {
  runSequence('clean',
    ['browserify', 'vendor-bundle', 'partials', 'styles', 'fonts'],
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
  gulp.watch(paths.scripts, ['browserify']);
  gulp.watch(paths.index, ['build-index']);
  gulp.watch(paths.partials, ['partials']);

  //gulp.watch(config.images,  ['images']);
  //gulp.watch(config.svg,     ['copy:fonts']);
});

gulp.task('default', ['watch'], function () {

});
