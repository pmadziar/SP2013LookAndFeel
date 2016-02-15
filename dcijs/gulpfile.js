var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var mainBowerFiles = require('gulp-main-bower-files');
var sass = require('gulp-sass');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');
var path = require('path');
var flatten = require('gulp-flatten');
var moment = require('moment');

var buildDir = "/Program Files/Common Files/microsoft shared/Web Server Extensions/15/TEMPLATE/LAYOUTS/nova.gov.sp.dci";
var jsDir = buildDir + "/js";
var cssDir = buildDir + "/css";
var fontDir = buildDir + "/fonts";
var testJsDir = buildDir + "/testJs";

var projectName = "dci";

var compilerOptions = require("./tsconfig.json").compilerOptions;

// var compilerOptions = {
// 	"module": "commonjs",
// 	"target": "ES3",
// 	"noImplicitAny": true,
// 	"removeComments": true,
// 	"preserveConstEnums": true,
// 	"sortOutput ": true
// };

// update version number and date for HB templates
var hbData = require("./handlebars/handlebarsData.json");

hbData.date = moment().format("YYYY/MM/DD HH:mm:ss");
var version = 0;
if(hbData.version|| hbData.version === 0){
    version = hbData.version + 1;
}

hbData.version = version;

fs.writeFileSync("./handlebars/handlebarsData.json", JSON.stringify(hbData));

gulp.task('bower-files', function() {
    var bConf = {
        "overrides":{
            "susy": {
                "ignore": true
            },
            "normalize-scss": {
                "ignore": true
            }
        }
    }
//normalize-scss
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles(bConf))
        .pipe(flatten())
        .pipe(gulp.dest(jsDir));
});

gulp.task('copy-html', function() {
    return gulp.src('html/*.{htm,html}').pipe(gulp.dest(buildDir));
});

gulp.task('copy-css', function() {
    return gulp.src('css/*.css').pipe(gulp.dest(cssDir));
});

gulp.task('copy-js', function() {
    return gulp.src('js/**/*.{js,map}').pipe(flatten()).pipe(gulp.dest(jsDir));
});


gulp.task('copy-fonts', function() {
    return gulp.src('fonts/*').pipe(gulp.dest(fontDir));
});

gulp.task('ts-compile', function(){
    var tsResult = gulp.src('TS/*.ts')
                       .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
                       .pipe(ts(compilerOptions));
    
    return tsResult.js
                .pipe(concat(projectName + '.js')) // You can use other plugins that also support gulp-sourcemaps 
                .pipe(sourcemaps.write("./")) // Now the sourcemaps are added to the .js.map file 
                .pipe(gulp.dest(jsDir));
});

gulp.task('ts-compile-tests', function(){
    var tsResult = gulp.src(['TSTESTS/*.ts'])
                       .pipe(ts(compilerOptions))
                       .js
                       .pipe(gulp.dest(jsDir));
});

// Gulp Sass Task 
gulp.task('sass', function() {

    var sassConfig = {
        errLogToConsole: true,
        sourceComments : 'normal',
        indentedSyntax: true,
        includePaths: [
            __dirname + '/bower_components/susy/sass',
            __dirname + '/bower_components/support-for/sass',
            __dirname + '/bower_components/normalize-scss/sass'
        ]
    };

    return gulp.src('scss/*.{scss,sass}')
        // Initializes sourcemaps
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig))
        // Writes sourcemaps into the CSS file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssDir));
});

// handllebars HTML
gulp.task('handlebars', function () {
    var templateData;
    var options = {
        ignorePartials: false,
        batch : ['./handlebars/partials']
    };


    return gulp.src('handlebars/*.handlebars')
        .pipe(data(function(file) {
            templateData = hbData;
            return templateData;
        }))
        .pipe(handlebars(templateData, options))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest(buildDir));
});

gulp.task('watch', function() {
  gulp.watch('TS/*.ts', ['ts-compile']);
  gulp.watch('TSTESTS/*.ts', ['ts-compile-tests']);
  gulp.watch('handlebars/**/*.handlebars', ['handlebars']);
  gulp.watch('scss/**/*.{scss,sass}', ['sass']);
});


gulp.task('copy-files',['bower-files', 'copy-js', 'copy-css', 'copy-html', 'copy-fonts']);

gulp.task('default',['copy-files', 'handlebars', 'sass', 'ts-compile','ts-compile-tests']);
