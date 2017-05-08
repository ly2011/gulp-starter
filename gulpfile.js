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
  sourcemaps = require("gulp-sourcemaps"),
  merge = require("merge-stream");

var condition = true;
var is_pc = true;

// 目标目录清理
gulp.task("clean", function() {
  var clearSrc = "";
  if (condition) {
    clearSrc = "dist";
  } else {
    if (is_pc) {
      clearSrc = "dist/pc";
    } else {
      clearSrc = "dist/wap";
    }
  }
  return gulp
    .src([clearSrc], { read: false })
    .pipe(clean({ force: true }))
    .on("error", swallowError);
});

//字体复制

gulp.task("font", function() {
  var fontSrc = "", fontDest = "";
  if (condition) {
    var fontArr = ["pc", "wap"];
    var tasks = fontArr.map(function(item) {
      return gulp
        .src("src/" + item + "/font/**/*.ttf")
        .pipe(gulp.dest("dist/" + item + "/font"));
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      fontSrc = "src/pc/font/**/*.ttf";
      fontDest = "dist/pc/font";
    } else {
      fontSrc = "src/wap/font/**/*.ttf";
      fontDest = "dist/wap/font";
    }
    return gulp.src(fontSrc).pipe(gulp.dest(fontDest));
  }
});

// index.html特殊对待
gulp.task("index_html", function() {
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

  var htmlSrc = "src/*.html", htmlDest = "dist";

  return gulp
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
    .pipe(gulp.dest(htmlDest));
});

//公用html
gulp.task("fileinclude", function() {
  var htmlSrc = "", htmlDest = "";

  if (condition) {
    var htmlArr = ["pc", "wap"];
    var tasks = htmlArr.map(function(item) {
      return gulp
        .src("src/" + item + "/html/**/*.html")
        .pipe(
          fileinclude({
            prefix: "@@",
            basepath: "@file"
          })
        )
        .on("error", swallowError)
        .pipe(gulp.dest("dist/" + item + "/html"));
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      htmlSrc = "src/pc/html/**/*.html";
      htmlDest = "dist/pc/html";
    } else {
      htmlSrc = "src/wap/html/**/*.html";
      htmlDest = "dist/wap/html";
    }
    return gulp
      .src(htmlSrc)
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file"
        })
      )
      .on("error", swallowError)
      .pipe(gulp.dest(htmlDest));
  }
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

  var htmlSrc = "", htmlDest = "";

  if (condition) {
    var htmlArr = ["pc", "wap"];
    var tasks = htmlArr.map(function(item) {
      return gulp
        .src("src/" + item + "/html/**/*.html")
        .pipe(
          fileinclude({
            prefix: "@@",
            basepath: "@file"
          })
        )
        .pipe(htmlmin(options))
        .pipe(plumber())
        .on("error", swallowError)
        .pipe(gulp.dest("dist/" + item + "/html"));
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      htmlSrc = "src/pc/html/**/*.html";
      htmlDest = "dist/pc/html";
    } else {
      htmlSrc = "src/wap/html/**/*.html";
      htmlDest = "dist/wap/html";
    }
    return gulp
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
      .pipe(gulp.dest(htmlDest));
  }
});
//编译sass,压缩css并输出
// var sassSrc = "src/sass/**/*.scss",
//   sassDest = "src/css",
//   cssSrc = "src/css/**/*.css",
//   cssDest = "dist/css",
//   cssRev = "dist/rev/css";
gulp.task("sass", function() {
  var sassSrc = "", sassDest = "", cssSrc = "", cssDest = "", cssRev = "";

  if (condition) {
    var sassArr = ["pc", "wap"];
    var tasks = sassArr.map(function(item) {
      sassSrc = "src/" + item + "/sass/**/*.scss";
      sassDest = "src/" + item + "/css";
      cssDest = "dist/" + item + "/css";
      cssRev = "dist/" + item + "/rev/css";
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
    return merge(tasks);
  } else {
    if (is_pc) {
      sassSrc = "src/pc/sass/**/*.scss";
      sassDest = "src/pc/css";
      cssDest = "dist/pc/css";
      cssRev = "dist/pc/rev/css";
    } else {
      sassSrc = "src/wap/sass/**/*.scss";
      sassDest = "src/wap/sass";
      cssDest = "dist/wap/css";
      cssRev = "dist/wap/rev/css";
    }
    return (
      gulp
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
        .pipe(browserSync.stream())
    );
  }
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

gulp.task("uglifyjs", function() {
  var jsSrc = "", jsDest = "", jsRev = "";
  if (condition) {
    var jsArr = ["pc", "wap"];
    var tasks = jsArr.map(function(item) {
      return (gulp
          .src("src/" + item + "/pc/**/*.js")
          .pipe(plumber())
          // .pipe(gulpif(!condition, changed(jsDest)))
          // .pipe(rename({ suffix: '.min' }))
          .pipe(jshint())
          .pipe(gulpif(condition, uglify()))
          .pipe(gulpif(condition, rev()))
          .on("error", swallowError)
          .pipe(gulp.dest("dist/" + item + "/pc/js"))
          .pipe(gulpif(condition, rev.manifest()))
          .pipe(gulpif(condition, gulp.dest("dist/" + item + "/rev/js")))
          .pipe(browserSync.stream()) );
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      var jsSrc = "src/pc/js/**/*.js",
        jsDest = "dist/pc/js",
        jsRev = "dist/pc/rev/js";
    } else {
      var jsSrc = "src/wap/js/**/*.js",
        jsDest = "dist/wap/js",
        jsRev = "dist/wap/rev/js";
    }
    return (
      gulp
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
        .pipe(browserSync.stream())
    );
  }
});
//压缩图片并输出

gulp.task("images", function() {
  var imagesSrc = "src/images/**/*",
    imagesDest = "dist/images",
    imagesRev = "dist/rev/images";

  var imagesSrc = "", imagesDest = "", imagesRev = "";
  if (condition) {
    var imagesArr = ["pc", "wap"];
    var tasks = imagesArr.map(function(item) {
      imagesSrc = "src/" + item + "/images/**/*";
      imagesDest = "dist/" + item + "/images";
      return (gulp
          .src(imagesSrc)
          .pipe(plumber())
          .pipe(gulpif(!condition, changed(imagesDest)))
          .pipe(
            imagemin({
              optimizationLevel: 3,
              progressive: true,
              interlaced: true
            })
          )
          .on("error", swallowError)
          // .pipe(rev())
          .pipe(gulp.dest(imagesDest)) );
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      var imagesSrc = "src/pc/images/**/*",
        imagesDest = "dist/pc/images",
        imagesRev = "";
    } else {
      var imagesSrc = "src/wap/images/**/*",
        imagesDest = "dist/wap/images",
        imagesRev = "";
    }
    return (
      gulp
        .src(imagesSrc)
        .pipe(plumber())
        .pipe(gulpif(!condition, changed(imagesDest)))
        .pipe(
          imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
          })
        )
        .on("error", swallowError)
        // .pipe(rev())
        .pipe(gulp.dest(imagesDest))
    );
  }
});
//sprite图片生成
gulp.task("sprite", function() {
  var spriteImgSrc = "", spriteImgDest = "", spriteCssDest = "";
  if (condition) {
    var spriteArr = ["pc", "wap"];
    var tasks = spriteArr.map(function(item) {
      spriteImgSrc = "src/" + item + "/images/sprite/*.png";
      spriteImgDest = "src/" + item + "/images";
      spriteCssDest = "src/" + item + "/sass";
      var spriteData = gulp.src(spriteImgSrc).pipe(
        spritesmith({
          imgName: "sprite.png",
          cssName: "sprite.scss",
          cssFormat: "scss",
          imgPath: "../images/sprite.png"
        })
      );
      spriteData.img.pipe(gulp.dest(spriteImgDest));
      spriteData.css.pipe(gulp.dest(spriteCssDest));
      return spriteData;
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      spriteImgSrc = "src/pc/images/sprite/*.png";
      spriteImgDest = "src/pc/images";
      spriteCssDest = "src/pc/sass";
    } else {
      spriteImgSrc = "src/wap/images/sprite/*.png";
      spriteImgDest = "src/wap/images";
      spriteCssDest = "src/wap/sass";
    }
    var spriteData = gulp.src(spriteImgSrc).pipe(
      spritesmith({
        imgName: "sprite.png",
        cssName: "sprite.scss",
        cssFormat: "scss",
        imgPath: "../images/sprite.png"
      })
    );
    spriteData.img.pipe(gulp.dest(spriteImgDest));
    spriteData.css.pipe(gulp.dest(spriteCssDest));
    return spriteData;
  }
});

var totalRev = "dist/rev/**/*.json",
  totalHtml = "dist/*.html",
  revDest = "dist";
gulp.task("rev", function() {
  var totalRev = "", totalHtml = "", revDest = "";
  if (condition) {
    var revArr = ["pc", "wap"];
    var tasks = revArr.map(function(item) {
      totalRev = "dist/" + item + "/rev/**/*.json";
      totalHtml = "dist/" + item + "/html/**/*.html";
      revDest = "dist/" + item + "/html";
      return gulp
        .src([totalRev, totalHtml])
        .pipe(revCollector())
        .on("error", swallowError)
        .pipe(gulp.dest(revDest));
    });
    return merge(tasks);
  } else {
    if (is_pc) {
      totalRev = "dist/pc/rev/**/*.json";
      totalHtml = "dist/pc/html/**/*.html";
      revDest = "dist/pc/html";
    } else {
      totalRev = "dist/wap/rev/**/*.json";
      totalHtml = "dist/wap/html/**/*.html";
      revDest = "dist/wap/html";
    }
    return gulp
      .src([totalRev, totalHtml])
      .pipe(revCollector())
      .on("error", swallowError)
      .pipe(gulp.dest(revDest));
  }
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
    ["sass", "uglifyjs", "html", "index_html"],
    "browser-sync",
    "watch"
  );
});
gulp.task("dev_mobile", function() {
  condition = false;
  is_pc = false;
  // runSequence('clean', 'sprite', 'images', ['sass', 'uglifyjs', 'html'], 'rev', 'browser-sync', 'watch')
  runSequence(
    "sprite",
    "images",
    "font",
    ["sass", "uglifyjs", "html", "index_html"],
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
    ["sass", "uglifyjs", "html", "index_html"],
    "rev"
  );
});
//清除任务
// gulp.task('clean', ['clean']);
//同步测试任务
// gulp.task('sync',['browser-sync']);
//监听任务
gulp.task("watch", function() {
  var htmlSrc = "src/**/*.html",
    htmlDest = "dist",
    sassSrc = "src/**/*.scss",
    imagesSrc = ["src/pc/images/**/*", "src/wap/images/**/*"],
    jsSrc = ["src/**/*.js"];
  // 监听html
  gulp.watch(htmlSrc, ["html", "index_html"]).on("change", browserSync.reload);

  // 监听sass
  gulp.watch(sassSrc, ["sass"]);

  // 监听css，暂时不用
  // gulp.watch(cssSrc, ['css']);

  // 监听images
  gulp.watch(imagesSrc, ["images"]);

  // 监听js
  gulp.watch(jsSrc, ["uglifyjs"]);
});
