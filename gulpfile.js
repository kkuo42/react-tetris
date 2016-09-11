var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('buildandtest', shell.task([
  'browserify -t [ babelify --presets [ react es2015 ] ] app.js -o bundle.js',
]));

gulp.task('default', function() {
    gulp.watch(['*.js', 'test/*.js'], ['buildandtest']);
});
