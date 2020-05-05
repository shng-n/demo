const gulp = require('gulp');
const fs = require('fs');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const browsersync = require("browser-sync").create()

function html(done){
    const jsonData = './src/data/data.json',
            json = JSON.parse( fs.readFileSync( jsonData,'utf-8' ) ); //文字列をjsonオブジェクトに変換

    gulp.src('./src/ejs/index.ejs')
    .pipe(ejs())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./docs/'));

    for( var i = 0; i < json.length; i++ ) {
        var fileName = json[i].number;

        gulp.src('./src/ejs/template.ejs')
            .pipe(ejs({
                jData: json[i]
            }))
            .pipe(rename('No_' + fileName + '.html'))
            .pipe(gulp.dest('./docs/'));
    }
    done();
};


// sass
function styles() {
  return gulp
  .src('./src/sass/*.scss')
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./docs/css/'))
}
exports.default = gulp.series(gulp.parallel(styles, html), gulp.series(browserSync, watchFiles));


// browsersync
function browserSync(done){
  browsersync.init({
    server: {
      baseDir: "./docs/"
    },
    notify: false
  });
  done();
}

//watch
function watchFiles(done){
  const browserReload = () => {
    browsersync.reload();
    done();
  };
  gulp.watch('./src/sass/*.scss').on('change', gulp.series(styles, browserReload));
  gulp.watch('./src/ejs/**/*.scss').on('change', gulp.series(html, browserReload));
}
