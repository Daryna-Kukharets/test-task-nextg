const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

const paths = {
  scss: "./src/styles/**/*.scss",
  html: "./src/*.html",
  images: "./src/images/**/*.*",
};

async function clean() {
  const del = (await import("del")).deleteAsync;
  return del(["dist"]);
}

function images() {
  return gulp
    .src(paths.images)
    .pipe(gulp.dest("./dist/images"))
    .pipe(browserSync.stream({ once: true }));
}

function styles() {
  return gulp
    .src(paths.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src(paths.html)
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.images, { events: ["add", "change", "unlink"] }, images);
  gulp.watch(paths.html, html);
}

const build = gulp.series(clean, gulp.parallel(styles, html, images));

exports.styles = styles;
exports.html = html;
exports.images = images;
exports.serve = gulp.series(build, serve);
exports.build = build;
