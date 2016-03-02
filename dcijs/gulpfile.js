var exec = require('child_process').exec;
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
var gulpFilter = require('gulp-filter');


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
var handlebarsHelpers = require("./handlebars/handlebarsHelpers.js");

hbData.date = moment().format("YYYY/MM/DD HH:mm:ss");
var version = 0;
if(hbData.version|| hbData.version === 0){
    version = hbData.version + 1;
}

hbData.version = version;

fs.writeFileSync("./handlebars/handlebarsData.json", JSON.stringify(hbData));

gulp.task('bower-files', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(flatten())
        .pipe(gulpFilter("*.js"))
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

gulp.task('copy-aspx', function() {
    return gulp.src('aspx/*.aspx').pipe(gulp.dest(buildDir));
});

gulp.task('copy-shgeneric', function() {
    return gulp.src('/Source/github/shgeneric/Layouts/shgeneric/js/shgeneric.*').pipe(gulp.dest(jsDir));
});


gulp.task('copy-fonts', function() {
    return gulp.src('bower_components/font-awesome/fonts/*').pipe(gulp.dest(fontDir));
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

gulp.task('ts-compile-singles', function(){
    var tsResult = gulp.src(['TSNOCONCAT/*.ts'])
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
            __dirname + '/bower_components/normalize-css',
            __dirname + '/bower_components/compass-breakpoint/stylesheets',
            __dirname + '/bower_components/font-awesome/scss',
            __dirname + '/scss/partials',
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
        batch : ['./handlebars/partials'],
        helpers : handlebarsHelpers.functions
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

gulp.task('uploadMasterPage',['handlebars'], function (cb) {
    var exePath = "C:\\Source\\github\\dci\\uploadMpToSp\\bin\\x64\\Debug\\uploadMpToSp.exe"
    var mp = `C:${buildDir.replace("/","\\")}\\govConnect*.html`;
    var sp = "http://govconnect"
    var exeArgs = `"${mp}" "${sp}"`;    
    var exeCmd = `${exePath} ${exeArgs}`;
    exec(exeCmd, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('uploadDisplayTemplates',['handlebars','uploadMasterPage'], function (cb) {
    var exePath = "C:\\Source\\github\\dci\\uploadMpToSp\\bin\\x64\\Debug\\uploadMpToSp.exe"
    var mp = `C:${buildDir.replace("/","\\")}\\item_*.html`;
    var sp = "http://govconnect/_catalogs/masterpage/Display Templates/Content Web Parts/"
    var exeArgs = `"${mp}" "${sp}"`;    
    var exeCmd = `${exePath} ${exeArgs}`;
    exec(exeCmd, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('watch', function() {
  gulp.watch('TS/*.ts', ['ts-compile']);
  gulp.watch('TSNOCONCAT/*.ts', ['ts-compile-singles']);
  gulp.watch('handlebars/**/*.handlebars', ['uploadMasterPage','uploadDisplayTemplates']);
  gulp.watch('scss/**/*.{scss,sass}', ['sass']);
});




gulp.task('copy-files',['bower-files', 'copy-js', 'copy-css', 'copy-html', 'copy-fonts', 'copy-aspx', 'copy-shgeneric']);

gulp.task('default',['copy-files', 'sass', 'ts-compile','ts-compile-singles','uploadMasterPage','uploadDisplayTemplates']);
