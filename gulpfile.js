'use strict';
 
var gulp = require('gulp');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var media = require('gulp-group-css-media-queries');
var $ = require('gulp-load-plugins')();

// Task to compile .pug files
gulp.task('pug',function() {
 return gulp.src('./src/pug/**/!(_)*.pug')
 .pipe(pug({
    doctype: 'html',
    pretty: true
 }))
 .pipe(gulp.dest('./public/'));
});

// Task to get .css files
gulp.task('sass', function () {
    gulp.src('./src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe( prefix("last 1 version", "> 2%", "ie 8", "ie 7") )
        .pipe( media() )
        .pipe(gulp.dest('./public/assets/css'))
        .pipe($.connect.reload());
});

// Task to minify js files in one file
gulp.task('build-js', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/assets/js'));
});

// Watch Task
gulp.task('watch', function(){
    gulp.watch('./src/sass/**/*.sass', ['sass']);
    gulp.watch('./src/js/**/*.js', ['build-js']);
    gulp.watch('./src/pug/**/!(_)*.pug', ['pug']);
});

// Server Task
gulp.task('connect', function() {
    connect.server({
        root: __dirname+'/public/',
        livereload: true,
        port: process.env.PORT || 9000
    });
});

// build project
gulp.task('build', ['pug', 'build-js']);

// run serve
gulp.task('run-serve', ['connect', 'sass', 'watch', 'pug', 'build-js']);