var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('buildandtest', shell.task([
  'browserify -t [ babelify --presets [ react es2015 ] ] src/app.js -o app/static/bundle.js',
    'python3 autoversion.py --mode js',
]));

gulp.task('autocss', shell.task([
  'python3 autoversion.py --mode css',
]));

gulp.task('default', function() {
    gulp.watch(['*.js', 'src/*.js', 'src/components/*.js', 'test/*.js'], ['buildandtest']);
    gulp.watch(['app/static/*.css'], ['autocss']);
});
