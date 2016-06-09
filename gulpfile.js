/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


var gulp = require('gulp');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');
var $ = require('gulp-load-plugins')();
var del = require('del');
var jsReporter = require('jshint-stylish');
var annotateAdfPlugin = require('ng-annotate-adf-plugin');
var pkg = require('./package.json');
var name = pkg.name;

var templateOptions = {
  root: '../src/templates',
  module: 'adf'
};

var annotateOptions = {
  plugin: [
    annotateAdfPlugin
  ]
};

var minifyHtmlOptions = {
  empty: true,
  loose: true
};

var ngdocOptions = {
  html5Mode: false,
  title: 'ADF API Documentation'
};

var protractorOptions = {
  configFile: 'protractor.conf.js'
};

/** lint **/

gulp.task('csslint', function(){
  gulp.src('src/styles/*.css')
      .pipe($.csslint())
      .pipe($.csslint.reporter());
});

gulp.task('jslint', function(){
  gulp.src('src/scripts/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter(jsReporter));
});

gulp.task('lint', ['csslint', 'jslint']);

/** clean **/

gulp.task('clean', function(cb){
  del(['dist', '.tmp'], cb);
});

/** build **/

gulp.task('css', function(){
  gulp.src('src/styles/*.css')
      .pipe($.concat(name + '.css'))
      .pipe(gulp.dest('dist/'))
      .pipe($.rename(name + '.min.css'))
      .pipe($.minifyCss())
      .pipe(gulp.dest('dist/'));
});

gulp.task('js', function(){
  gulp.src(['src/scripts/*.js', 'src/templates/*.html'])
      .pipe($.if('*.html', $.minifyHtml(minifyHtmlOptions)))
      .pipe($.if('*.html', $.angularTemplatecache(name + '.tpl.js', templateOptions)))
      .pipe($.sourcemaps.init())
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      .pipe($.if('*.js', $.replace(/'use strict';/g, '')))
      .pipe($.concat(name + '.js'))
      .pipe($.headerfooter('(function(window, undefined) {\'use strict\';\n', '})(window);'))
      .pipe($.ngAnnotate(annotateOptions))
      .pipe(gulp.dest('dist/'))
      .pipe($.rename(name + '.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/'));
});

gulp.task('favicon', function(){
  gulp.src(['app/*.ico', 'app/*.png'])
      .pipe(gulp.dest('dist/app/'));
});

gulp.task('sampledata', function(){
  gulp.src('app/sample-data/*')
      .pipe(gulp.dest('dist/app/sample-data/'));
});

gulp.task('build', ['css', 'js', 'favicon', 'sampledata']);

/** build docs **/

gulp.task('docs', function(){
  return gulp.src('src/scripts/*.js')
    .pipe($.ngdocs.process(ngdocOptions))
    .pipe(gulp.dest('./dist/docs'));
});

/** build app **/
gulp.task('install-widgets', function(){
  return gulp.src('app/widgets/*/bower.json')
             .pipe($.install());
});

gulp.task('widget-templates', ['install-widgets'], function(){
  var opts = {
    root: '{widgetsPath}',
    module: 'fireboard'
  };
  return gulp.src('app/widgets/*/src/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('widgets.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('app-templates', function(){
  var opts = {
    root: 'partials',
    module: 'fireboard'
  };
  return gulp.src('app/partials/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('app.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('dashboard-templates', function(){
  var opts = {
    root: '../src/templates',
    module: 'adf'
  };
  return gulp.src('src/templates/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('adf.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('copy-font', function(){
  gulp.src('app/components/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('dist/app/fonts'));
});

gulp.task('app', ['widget-templates', 'app-templates', 'dashboard-templates', 'copy-font'], function(){
  var templates = gulp.src('.tmp/*.js', {read: false});
  var assets = $.useref.assets();
  gulp.src('app/index.html')
      // inject templates
      .pipe($.inject(templates, {relative: true}))
      .pipe(assets)
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      .pipe($.if('*.js', $.ngAnnotate(annotateOptions)))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.rev())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(gulp.dest('dist/app/'));
});

/** livereload **/

gulp.task('watch', function(){
  var paths = [
    'src/scripts/*.js',
    'src/styles/*.css',
    'src/templates/*.html',
    'app/*.html',
    'app/scripts/*.js',
    'app/partials/*.html',
    'app/widgets/*/*.js',
    'app/widgets/*/*.css',
    'app/widgets/*/*.html',
    'app/widgets/*/src/*.js',
    'app/widgets/*/src/*.css',
    'app/widgets/*/src/*.html'
  ];
  gulp.watch(paths).on('change', function(file){
    gulp.src(file.path)
        .pipe(connect.reload());
  });
});

gulp.task('webserver', ['install-widgets'], function(){
  connect.server({
    port: 9001,
    livereload: true,
    // redirect / to /app
    middleware: function() {
      return [
        modRewrite([
          '^/$ /app/ [R]'
        ])
      ];
    }
  });
});

gulp.task('serve', ['webserver', 'watch']);

/** e2e **/

// The protractor task
var protractor = require('gulp-protractor').protractor;

// Start a standalone server
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;

// Download and update the selenium driver
var webdriver_update = require('gulp-protractor').webdriver_update;

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// start webserver for e2e tests
gulp.task('e2e-server', ['install-widgets'], function(){
  connect.server({
    port: 9003
  });
});

// Setting up the test task
gulp.task('e2e', ['e2e-server', 'webdriver_update'], function(cb) {
  gulp.src('e2e/*Spec.js')
      .pipe(protractor(protractorOptions))
      .on('error', function(e) {
        // stop webserver
        connect.serverClose();
        // print test results
        console.log(e);
      })
      .on('end', function(){
        // stop webserver
        connect.serverClose();
        cb();
      });
});

/** shorthand methods **/
gulp.task('all', ['build', 'docs', 'app']);

gulp.task('default', ['build']);
