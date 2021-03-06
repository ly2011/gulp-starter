"use strict";

var path = require("path"),
  gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  reload = require("browser-sync").reload(),
  htmlmin = require("gulp-htmlmin"),
  clean = require("gulp-clean"),
  cleanCSS = require("gulp-clean-css"),
  autoprefixer = require("gulp-autoprefixer"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed"),
  rename = require("gulp-rename"),
  concat = require("gulp-concat"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify"),
  plumber = require("gulp-plumber"),
  spritesmith = require("gulp.spritesmith"),
  fileinclude = require("gulp-file-include"),
  runSequence = require("run-sequence"),
  gulpif = require("gulp-if"),
  rev = require("gulp-rev"),
  revCollector = require("gulp-rev-collector"),
  sass = require("gulp-sass"),
  filter = require("gulp-filter"),
  sourcemaps = require("gulp-sourcemaps");

var condition = true;

// 目标目录清理
gulp.task("clean", function() {
  return gulp
    .src(["dist"], { read: false })
    .pipe(clean({ force: true }))
    .on("error", swallowError);
});
//字体复制
var fontSrc = "src/font/*.ttf", fontDest = "dist/font";
gulp.task("font", function() {
  gulp.src(fontSrc).pipe(gulp.dest(fontDest));
});
var htmlSrc = "src/*.html", htmlDest = "dist";
//公用html
gulp.task("fileinclude", function() {
  gulp
    .src(htmlSrc)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .on("error", swallowError)
    .pipe(gulp.dest(htmlDest));
});
// HTML处理
gulp.task("html", function() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: false, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  return (gulp
      .src(htmlSrc)
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file"
        })
      )
      .pipe(htmlmin(options))
      .pipe(plumber())
      .on("error", swallowError)
      // .pipe(changed(htmlDest))
      .pipe(gulp.dest(htmlDest)) );
});
//编译sass,压缩css并输出
var sassSrc = "src/sass/**/*.scss",
  sassDest = "src/css",
  cssSrc = "src/css/**/*.css",
  cssDest = "dist/css",
  cssRev = "dist/rev/css";
gulp.task("sass", function() {
  return (gulp
      .src(sassSrc)
      .pipe(plumber())
      .pipe(gulpif(!condition, changed(sassDest)))
      .pipe(sass())
      .pipe(
        autoprefixer({
          browsers: ["last 5 versions", ">0.001%"],
          flexbox: true
        })
      )
      .on("error", swallowError)
      .pipe(gulp.dest(sassDest))
      // .pipe(changed(cssDest))
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .on("error", swallowError)
      .pipe(gulpif(condition, rev()))
      .pipe(gulp.dest(cssDest))
      .pipe(gulpif(condition, rev.manifest()))
      .pipe(gulpif(condition, gulp.dest(cssRev)))
      .pipe(browserSync.stream()) );
});
//压缩css并输出,暂时不用
gulp.task("css", function() {
  return (gulp
      .src(cssSrc)
      .pipe(plumber())
      .pipe(changed(cssDest))
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .on("error", swallowError)
      // .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(cssDest)) );
});
//压缩js并输出
var jsSrc = "src/js/**/*.js", jsDest = "dist/js", jsRev = "dist/rev/js";
gulp.task("uglifyjs", function() {
  return (gulp
      .src(jsSrc)
      .pipe(plumber())
      // .pipe(gulpif(!condition, changed(jsDest)))
      // .pipe(rename({ suffix: '.min' }))
      .pipe(jshint())
      .pipe(gulpif(condition, uglify()))
      .pipe(gulpif(condition, rev()))
      .on("error", swallowError)
      .pipe(gulp.dest(jsDest))
      .pipe(gulpif(condition, rev.manifest()))
      .pipe(gulpif(condition, gulp.dest(jsRev)))
      .pipe(browserSync.stream()) );
});
//压缩图片并输出
var imagesSrc = "src/images/**/*",
  imagesDest = "dist/images",
  imagesRev = "dist/rev/images";
gulp.task("images", function() {
  return (gulp
      .src(imagesSrc)
      .pipe(plumber())
      .pipe(gulpif(!condition, changed(imagesDest)))
      .pipe(
        imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
      )
      .on("error", swallowError)
      // .pipe(rev())
      .pipe(gulp.dest(imagesDest)) );

  // .pipe(rev.manifest())

  // .pipe(gulp.dest(imagesRev));
});
//sprite图片生成
gulp.task("sprite", function() {
  var spriteData = gulp.src("src/images/sprite/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "sprite.scss",
      cssFormat: "scss",
      imgPath: "../images/sprite.png"
    })
  );
  spriteData.img.pipe(gulp.dest("src/images"));
  spriteData.css.pipe(gulp.dest("src/sass"));
});

var totalRev = "dist/rev/**/*.json",
  totalHtml = "dist/*.html",
  revDest = "dist";
gulp.task("rev", function() {
  gulp
    .src([totalRev, totalHtml])
    .pipe(revCollector())
    .on("error", swallowError)
    .pipe(gulp.dest(revDest));
});

//browser-sync同步测试
gulp.task("browser-sync", function() {
  browserSync.init({
    open: true,
    notify: false,
    port: 8000,
    browser: "chrome",
    server: {
      baseDir: "dist"
    }
  });

  // gulp.watch(sassSrc, ['sass']);

  // gulp.watch(htmlSrc).on('change', browserSync.reload);

  // gulp.watch(jsSrc, ['uglifyjs']);
});

function swallowError(error) {
  console.error(error.toString());

  this.emit("end");
}

//默认任务
// gulp.task('default', ['html', 'browser-sync', 'sass', 'uglifyjs', 'images', 'sprite', 'rev', 'watch']);
gulp.task("default", function() {
  condition = false;
  // runSequence('clean', 'sprite', 'images', ['sass', 'uglifyjs', 'html'], 'rev', 'browser-sync', 'watch')
  runSequence(
    "sprite",
    "images",
    "font",
    ["sass", "uglifyjs", "html"],
    "browser-sync",
    "watch"
  );
});
//线上自动部署
gulp.task("build", function() {
  runSequence(
    "clean",
    "sprite",
    "images",
    "font",
    ["sass", "uglifyjs", "html"],
    "rev"
  );
});
//清除任务
// gulp.task('clean', ['clean']);
//同步测试任务
// gulp.task('sync',['browser-sync']);
//监听任务
gulp.task("watch", function() {
  // 监听html
  gulp.watch(htmlSrc, ["html"]).on("change", browserSync.reload);

  // 监听sass
  gulp.watch(sassSrc, ["sass"]);

  // 监听css，暂时不用
  // gulp.watch(cssSrc, ['css']);

  // 监听images
  gulp.watch(imagesSrc, ["images"]);

  // 监听js
  gulp.watch(jsSrc, ["uglifyjs"]);
});
