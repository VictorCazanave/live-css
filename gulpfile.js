var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	cssmin = require('gulp-cssmin'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),

	paths = {
		src: './src',
		dist: './dist',
		js: ['./src/*.js'],
		less: ['./src/*.less'],
		css: ['./src/*.css']
	};

// Generate css files
gulp.task('less', function () {
	return gulp.src(paths.less)
		.pipe(less())
		//.pipe(autoprefixer({
		//	browsers: ['last 3 versions']
		//}))
		.pipe(gulp.dest(paths.src));
});

// Watch less files
gulp.task('watch', function () {
	gulp.watch(paths.less, ['less']);
});


// Build js and css files
gulp.task('build', ['less'], function () {
	gulp.src(paths.js)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.dist));

	gulp.src(paths.css)
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.dist));
});