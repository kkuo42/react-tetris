var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('buildandtest', shell.task([
  'browserify -t [ babelify --presets [ react es2015 ] ] src/app.js -o app/static/bundle.js',
    'python3 autoversion.py',
]));

gulp.task('default', function() {
    gulp.watch(['*.js', 'src/*.js', 'test/*.js'], ['buildandtest']);
});
