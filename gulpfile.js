var del = require('del'),
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  htmlmin = require('gulp-htmlmin'),
  minifyCss = require('gulp-minify-css'),
  rev = require('gulp-rev'),
  usemin = require('gulp-usemin'),
  util = require('gulp-util'),
  watch = require('gulp-watch'),
  babili = require('gulp-babili'),
  tinypng = require('gulp-tinypng');


/**
 * CONFIG
 * - General configuration for this project
 */
let config = {
  tinypng: {
    apikey: 'fGe2JxyVjUw2Uw27WAXd3R9Xj_t1T61v'
  }
}


/**
 * COPYRESOURCES
 * - Copies resources provided in resources hash
 */
let copyResources = (resources) => {
  return Promise.all(resources.map(function (resource) {
    return new Promise(function (resolve, reject) {
      gulp.src(resource.glob)
        .on('error', reject)
        .pipe(gulp.dest(config.buildPath + resource.dest))
        .on('end', resolve)
    });
  }));
}


/**
 * MINH
 * - Minifies and concatenates globbed .HTML files including nested Javascript and CSS resources
 */
let minh = () => {
  return new Promise(function (resolve, reject) {
    gulp.src(config.buildPath + '/*.html')
      .on('error', reject)
      .pipe(debug())
      .pipe(usemin({
        css: [function () { return minifyCss(); }, function () { return rev(); }],
        html: [function () { return htmlmin({ collapseWhitespace: true, removeComments: true }); }],
        js: [function () {
          return babili({
            mangle: {
              keepClassNames: true
            }
          });
        }, function () { return rev(); }],
        inlinejs: [babili({
          mangle: {
            keepClassNames: true
          }
        })],
        inlinecss: [minifyCss(), 'concat']
      }))
      .pipe(gulp.dest(config.buildPath))
      .on('end', resolve);
  })
}


/**
 * BUILD
 * - The actual build pipeline that clears a target, compiles views, copies images and fonts, minifies and cleans up
 */
let build = async () => {
  // if (config.target !== 'dev') {
  //   console.error('gulp-uglify does not support ES6 yet. Exiting...')
  //   return;
  // }
  await del([config.buildPath + '**/*']);
  let c = await copyResources([
    {
      glob: ['./src/res/manifest.json'],
      dest: '/'
    },
    {
      glob: ['./src/views/**/*.html'],
      dest: '/'
    },
    {
      glob: ['./src/img/logo.png'],
      dest: '/img/'
    },
    {
      glob: ['./src/js/**/*.js'],
      dest: '/js/'
    },
    {
      glob: ['./src/js/friendlyFeedClient.js'],
      dest: '/'
    },
    {
      glob: ['./src/css/**/*'],
      dest: '/css/'
    }
  ]);

  // Prod has single JS and CSS so we can clean up the unminified files
  if (config.target !== 'dev') {
    await minh();
    // Cleanup temporary CSS created prior to minification (JS will happen after UglifyJS supports ES6)
    c = await del([config.buildPath + '/js', config.buildPath + '/css']);
  }
  return c;
}


/**
 * Compress png and jpgs. Calling manually for now until I can figure the optimal way to ensure I 
 * stay below 500 calls per month
 */
gulp.task('tinypng', () => {
  gulp.src(['./src/img/**/*.jpg', './src/img/**/*.png'])
    .pipe(tinypng(config.tinypng.apikey))
    .pipe(gulp.dest(config.buildPath + '/img'));
});


/**
 * TEST
 * - Used for occasional prototyping and testing of new gulp tasks
 */
gulp.task('test', function () {

});


/**
 * BUILD
 * - A gulp task wrapper around build()
 */
gulp.task('build', function () {
  return build(); // Currently no promise wrapped around build()!
})


/**
 * WATCH
 * - Watches src/ and automatically builds into build/dev
 */
gulp.task('watch', function () {
  // Some hacky sh!t for build and deploy needs to be cleaned up a bit
  return watch('src/**/*', function () {
    build()
      .then(result => {
        gulp.start('build');
      })
  });
});


/** 
 * HELP
 * - Display some basic help info
 */
gulp.task('help', function () {
  console.log(`
  
  Usage: gulp <command> [options]
    
    where <command> is one of:
      build:   Clean, compile views, copy resources, optionally minify and clean up                     
               options:
                 --target [dev] | release

      watch:   Starts a watcher on src and updates any changes to build/dev
  `)
});


/**
 * DEFAULT
 * - Show the help message
 */
gulp.task('default', ['help']);


/**
 * Set up the config object defaults based on --target flag
 */
(function () {
  config.target = util.env.target || 'dev';
  switch (config.target.toLowerCase()) {
    case 'release':
      config.buildPath = 'build/release/';
      break;
    default:
      config.buildPath = 'build/dev/';
      break;
  }
})();
