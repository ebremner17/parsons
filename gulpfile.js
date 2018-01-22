module.exports = (function () {
  var pkg = require('./package.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    minifyCSS = require('gulp-minify-css'),
    plugins = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();

  var config = {
    sass:'./sass/*.{scss,sass}',
    sassSrc:'./sass/parsons.scss',
    sassIe:'./sass/ie.scss',
    sassPrint:'./sass/print.scss',
    css:'./css',
    js:'./scripts',
    jsSrc:'./js/resp.js',
    images:'./images/*.{png,gif,jpeg,jpg,svg}',
    imagesmin:'./images/minified',
  };

  var AUTOPREFIXER_BROWSERS = [
    '> 1%',
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

  gulp.task('styles',function () {
    return gulp.src(config.sassSrc)
       // .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber())
      .pipe(plugins.sass({
        includePaths: require('node-bourbon').includePaths,
        outputStyle: 'collapsed'
      }))
        .on('error', function (err) {
          gutil.log(err);
          gutil.beep();
          this.emit('end');
        })
      .pipe(plugins.autoprefixer({
        browsers:AUTOPREFIXER_BROWSERS,
        cascade: false
      }))
        .pipe(minifyCSS())
        .pipe(plugins.concat('parsons.css'))
        .pipe(gulp.dest(config.css))
        .pipe(browserSync.stream())
        .pipe(plugins.size({title:'css'}));
  });

  gulp.task('watch',[],function () {
    gulp.watch(config.sass,['styles']);
  });

  gulp.task('default',[],function () {
    gulp.start('styles','watch');
  });
})();
