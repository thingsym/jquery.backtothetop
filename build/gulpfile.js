'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var printf = require('printf');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var pkg = require('./package.json');

var src_paths = {
  html: ['../test/*.html'],
  scripts: ['../jquery.backtothetop.js'],
  dist: ['../jquery.backtothetop.min.js']
};

var dist_paths = {
  scripts: '../',
  docs: '../docs/js',
  browserSync: '../test',
};

gulp.task('default', function() {
  var date = new Date();
  var licenses = [];
  for (var license in pkg.licenses) {
    licenses.push(pkg.licenses[license].url);
  }

  var header = [ '/*!',
    ' * <%= pkg.title %>',
    ' * Version <%= pkg.version %>',
    ' * Update: ' + printf('%04d-%02d-%02d %02d:%02d:%02d', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
    ' * Copyright ' + printf('%04d', date.getFullYear()) + ' <%= pkg.author %>',
    ' * URI: <%= pkg.url %>',
    ' * Repository: <%= pkg.repository.url %>',
    ' * License: <%= pkg.license %>',
    ' * ' + licenses.join("\n * "),
    '*/',
    ''].join('\n');

  gulp.src(src_paths.scripts)
    .pipe($.header(header, { pkg : pkg }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(dist_paths.scripts));
});

gulp.task('docs', function() {
  gulp.src(src_paths.dist)
    .pipe(gulp.dest(dist_paths.docs));
});

gulp.task('browser-sync', function() {
  browserSync.init({
      // proxy: '0.0.0.0',
      // open: false,
      server: {
        baseDir: dist_paths.browserSync
      },
      files: [
        dist_paths.browserSync + '/**'
      ]
    });

    gulp.watch([ src_paths.scripts ], ['default']);
    gulp.watch([ src_paths.dist ], function () {
      gulp.src(src_paths.dist)
        .pipe(gulp.dest(dist_paths.browserSync));
    }).on('change', reload);
});

gulp.task('watch', function() {
  gulp.watch(src_paths.scripts, ['default']);
});
