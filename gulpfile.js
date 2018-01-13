let path = require('path')
  , gulp = require('gulp')
  , iconFont = require('gulp-iconfont')
  , config = require('gulp-font-icons').config
  , generateIconSass = require('gulp-font-icons').generateIconSass;

const ROOT = path.resolve(__dirname, 'src');
const root = path.join.bind(path, ROOT);

let options = Object.assign(config, {
  iconSrc: root('assets/icons/*.svg'),
  iconDest: root('assets/fonts/icon-fonts'),
  sassTemplate: root('assets/styles/base/icon.sass.template'),
  sassDest: root('assets/styles/base'),
  sassOutputName: '_icons.scss',
  fontName: 'instu-icons',
  fontPath: '/assets/fonts/icon-fonts',
  options: {
      appendUnicode: false,
      normalize: false,
      fontName: 'instu-icons',
  },
  className: 'instu',
  comment:'This file auto generated from gulp file'
});

/**
 * Generate icons
 */
gulp.task('generate:fonts', function() {
  return gulp.src(['src/assets/icons/*.svg'])
    .pipe(iconFont({
      fontName: 'instu-icons',
      formats: ['woff', 'woff2', 'ttf', 'svg']
    }))
    .on('glyphs', function(glyphs, options) {
      generateIconSass(glyphs, options);
    })
    .pipe(gulp.dest('src/assets/fonts/icon-fonts'));
});


/**
 * Task Runners
 */

// Compile files
gulp.task('fonts', [
    'generate:fonts'
]);
