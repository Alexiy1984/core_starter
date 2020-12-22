const { src, dest, watch, parallel, series } = require('gulp');

const pug = require('gulp-pug'),
data = require('gulp-data'),
sync = require('browser-sync').create(),
fs = require('fs'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer'),
plumber = require('gulp-plumber'),
del = require('del'),
babel = require("gulp-babel"),
merge = require('merge-stream'),
uglify = require('gulp-uglify-es').default;

var sassOptions = {
  outputStyle: 'expanded',
};

var prefixerOptions = {
  browserlist: ['last 3 versions']
};

var buildPaths = {
  source: {
    mainDir: 'views',
    componentsDir: 'views/components',
  },
  destination: {
    mainDir: 'public',
    componentsDir: 'public/components',
  }
}

function getDirectories(source) {
  const all_dir = fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

    const comp_dir = all_dir.filter(elt => elt.substr(0,1) !== '_')

  return comp_dir;  
}
  
function getComponentsDirectories(cb) {
  console.log(getDirectories('./views/components'));
  cb();
}

function buildIndex() {
  del([
    'public/index.html', 
    'public/components/*.*',
    '!public/components/*.md'
  ]);
  var main_index = src('views/index.pug')
    .pipe(plumber())
    .pipe(data(function(file){return JSON.parse(fs.readFileSync('./data/data.json'))}))
    .pipe(pug({doctype: 'html', pretty: true}))
    .pipe(dest('public'));
  var components_index = src('views/components/*.pug')
    .pipe(plumber())
    .pipe(data(function(file){return JSON.parse(fs.readFileSync('./data/data.json'))}))
    .pipe(pug({doctype: 'html', pretty: true}))
    .pipe(dest('public/components'));  
  return merge(main_index, components_index);
}
 
function buildLayouts(cb) {
  del([
    'public/layouts/**/*', 
    '!public/layouts/**/*.md',
  ]);
  src([ 
    'views/layouts/**/*.pug',
    '!views/**/_*/',
    '!views/**/_*/**/*',
  ])
    .pipe(plumber())
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('./data/data.json'))
    }))
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(dest('public/layouts'))
    .pipe(sync.stream());
  cb();
}

function buildPugComponent(componentDir) {
  del([
    `${buildPaths.destination.componentsDir}/${componentDir}/**`, 
    `!${buildPaths.destination.componentsDir}/${componentDir}`, 
    `!${buildPaths.destination.componentsDir}/${componentDir}/*.md`,
    `!${buildPaths.destination.componentsDir}/${componentDir}/*.js`,
  ]);
  src([ 
    `${buildPaths.source.componentsDir}/${componentDir}/**/*.pug`,
  ])
    .pipe(plumber())
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('./data/data.json'))
    }))
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(dest(`${buildPaths.destination.componentsDir}/${componentDir}`))
}

function buildPugComponents() {
  del([
    `${buildPaths.destination.componentsDir}/**`,
    `!${buildPaths.destination.componentsDir}/index.html`,
  ]);
  var compiled_comps = 0;
  var comps_dirs = getDirectories('./views/components');

  comps_dirs.forEach(name => {
    console.log(`\x1b[37m Build \x1b[32m${name} \x1b[34mcomponent`);
    buildPugComponent(name);
    compiled_comps++;
  });

  return new Promise(function(resolve, reject) {
    console.log(`\x1b[37mTotal \x1b[35m${compiled_comps} \x1b[37mout of \x1b[35m${comps_dirs.length} \x1b[37mcomponents was \x1b[36mbuilded`);
    resolve();
  });
}

function generateCSS(cb) {
  del(['public/stylesheets/**', '!public/stylesheets']);
  src('./scss/*.scss')
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(prefixerOptions))
      // .pipe(concat('index.css'))
      .pipe(dest('public/stylesheets'))
      .pipe(sync.stream());
  cb();
}

function copyAssets(cb) {
  del(['public/assets/**', '!public/assets/svg']);
  src('./assets/**/*')
    .pipe(dest('public/assets'))
  cb();
}

function copyReadme(cb) {
  del(['public/**/*.md']);
  src('views/**/*.md')
    .pipe(dest('public/'))
  cb();
}

function buildCoreJs(cb) {
  del([
    'public/javascripts/jquery.min.js', 
    'public/javascripts/jquery.min.map', 
    'public/javascripts/bootstrap.bundle.min.js',
    'public/javascripts/bootstrap.bundle.min.js.map',
    'public/javascripts/imask.min.js',
    'public/javascripts/imask.min.js.map',
  ]);
  src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery/dist/jquery.min.map',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map',
    'node_modules/imask/dist/imask.min.js',
    'node_modules/imask/dist/imask.min.js.map',
  ])
    .pipe(dest('public/javascripts'))
    .pipe(sync.stream());
  cb();
};

function bulidMainJs(cb) {
  del('public/javascripts/main.js');
  src([
    'views/components/**/*.js',
    '!views/components/**/_*.js',
  ])
    .pipe(babel()) 
    //.pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(dest('public/javascripts'))
    .pipe(sync.stream());
  cb();
};

function browserSync(cb) {
  buildIndex(cb);
  buildLayouts(cb); 
  buildPugComponents(cb);
  generateCSS(cb);
  buildCoreJs(cb);
  bulidMainJs(cb);
  copyAssets(cb);
  copyReadme(cb);

  sync.init({
      server: {
          baseDir: './public'
      }
  });
  
  watch('./assets/**/*', copyAssets);
  watch(['./views/layouts/**/*.pug']).on('change', function (path) {
    buildLayouts;
    console.log(`File \x1b[35m${path}\x1b[37m was \x1b[36mchanged`);
  });
  watch('./views/**/*.md').on('change', function (path) {
    copyReadme;
    console.log(`File \x1b[35m${path}\x1b[37m was \x1b[36mchanged`);
  });;
  watch(['./views/index.pug', './views/components/index.pug'], buildIndex);
  watch(['./views/components/**/*.pug', '!./views/components/index.pug'], {delay: 3000})
    .on('change', function (path) {
      console.log(`File \x1b[35m${path}\x1b[37m was \x1b[36mchanged`);
      var changed_dir = path.replace(buildPaths.source.componentsDir, '').split('/')[1];
      buildPugComponent(changed_dir);
      console.log(`\x1b[37mBuild \x1b[32m${changed_dir} \x1b[34mcomponent`);
    });
  watch('./scss', generateCSS);
  watch('./views/components/**/*.js', bulidMainJs);
  watch('./public/**/*.html').on('change', sync.reload);
}

exports.default = parallel(series(buildIndex, buildLayouts, buildPugComponents), copyReadme, generateCSS, buildCoreJs, bulidMainJs, copyAssets);
exports.sync = browserSync;
exports.css = generateCSS;
exports.corejs = buildCoreJs;
exports.mainjs = bulidMainJs;
exports.buildlts = buildLayouts;
exports.buildcoms = buildPugComponents;
exports.buildindex = buildIndex;
//For test purposes
exports.getcomsdir = getComponentsDirectories;
