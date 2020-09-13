"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const imagemin = require('gulp-imagemin');
const webP = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const uglify = require("gulp-uglify");

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/js/**",
    "source/*.html",
    "source/*.ico"
  ], {
      base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

const clean = () => {
    return del("build");
};

// Style

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
       autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const sprite = () => {
    return gulp.src("source/img/**/icon-*.svg")
        .pipe(svgstore())
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"))
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("js"));
  gulp.watch("source/*.html").on("change", gulp.series("copy", sync.reload));
}

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.mozjpeg({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

const webp = () => {
  return gulp.src("build/img/**/*.{png,jpg}")
      .pipe(webP({quality: 90}))
      .pipe(gulp.dest("build/img"))
}

exports.webp = webp;

const js = () => {
  return gulp.src("source/js/*.js")
      .pipe(plumber())
      .pipe(uglify())
      .pipe(rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest("build/js"))
}

exports.js = js;

const build = gulp.series(
    clean,
    gulp.parallel(
      copy,
      styles,
      js,
      sprite,
      images,
    ),
    webp,
);

exports.build = build;

const start = gulp.series(build, gulp.parallel(server, watcher));

exports.start = start;
