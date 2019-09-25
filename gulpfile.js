'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');


gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/sass'));
});

gulp.task('default', function() {
    nodemon({
        script: 'development.js',
        ext: 'js html',
        env: {},
        ignore: ['public']
    });
    gulp.watch('./public/sass/*.scss', ['sass']);
});

var script1 = [
    './public/libs/jquery/dist/jquery.js',
    './public/js/bootstrap.min.js',
    './public/js/owl.carousel.min.js',
    './public/js/jquery.sticky.js',
    './public/libs/angular/angular.min.js',
    './public/js/popper.js',
    './public/js/easing.min.js',
    './public/js/hoverIntent.js',
    './public/js/superfish.min.js',
    './public/js/parallax.min.js',
    './public/js/main.js',
    './public/libs/angular-route/angular-route.min.js',
    './public/libs/angular-toastr/dist/angular-toastr.tpls.js',
    './public/libs/angular-sanitize/angular-sanitize.min.js',
    './public/libs/angular-ui-router/release/angular-ui-router.min.js',
    './public/libs/angular-resource/angular-resource.min.js',
    './public/libs/angular-mocks/angular-mocks.js',
    './public/libs/angular-cookies/angular-cookies.js',
    './public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
    './public/libs/angular-animate/angular-animate.min.js',
    './public/js/dropzone/dropzone.js',
];

gulp.task('min-js-1', function() {
    return gulp.src(script1)
        .pipe(concat('script-1.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('public/iccaches/'));
});

var script2 = [
    './public/js/icConfig.js',
    './public/angular/routes/icMean.js',
    './public/angular/config/config.js',
    './public/angular/controllers/commonController.js',
    './public/angular/controllers/user.js',
    './public/angular/controllers/homeController.js',
    './public/angular/controllers/contactController.js',
    './public/angular/controllers/aboutUsController.js',
    './public/angular/controllers/userDashboardController.js',
    './public/angular/controllers/candidatesRegisterController.js',
    './public/angular/services/icMean.js',
];

gulp.task('min-js-2', function() {
    return gulp.src(script2)
        .pipe(concat('script-2.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('public/iccaches/'));
});

var script3 = [
    './public/js/icConfig.js',
    './public/admin-angular/routes/icMean.js',
    './public/admin-angular/config/config.js',
    './public/admin-angular/controllers/adminController.js',
    './public/admin-angular/controllers/user.js',
    './public/admin-angular/controllers/dashboardController.js',
    './public/admin-angular/controllers/qualificationController.js',
    './public/admin-angular/controllers/locationsController.js',
    './public/admin-angular/controllers/siteContentController.js',
    './public/admin-angular/controllers/jobsController.js',
    './public/admin-angular/controllers/candidateMgmtController.js',
    './public/admin-angular/controllers/companyUserMgmtController.js',
    './public/admin-angular/controllers/userInquiryMgmt.js',
    './public/admin-angular/controllers/advertisement.js',
    './public/admin-angular/controllers/accountController.js',
    './public/admin-angular/controllers/attendance.js',
    './public/admin-angular/services/icMean.js',
];

gulp.task('min-js-3', function() {
    return gulp.src(script3)
        .pipe(concat('script-admin-1.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('public/iccaches/'));
});

var cssFiles = [
    './public/css/bootstrap.min.css',
    './public/css/magnific-popup.css',
    './public/libs/angular-toastr/dist/angular-toastr.css',
    './public/css/owl.carousel.min.css',
    './public/css/animate.css',
    './public/css/style.css',
    './public/css/main.css',
    './public/css/nice-select.css',
    './public/css/font-awesome.min.css',
    './public/css/linearicons.css',
    './public/js/dropzone/dropzone.css',
    './public/css/sass/global.css',
];

gulp.task('min-css', function() {
    return gulp.src(cssFiles)
        .pipe(concat('final.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/iccaches/'));
});

gulp.task('compile', ['sass', 'min-js-1', 'min-js-2', 'min-js-3', 'min-css']);
