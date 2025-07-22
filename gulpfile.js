const {src, dest, watch, task, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const sortMQ = require('postcss-sort-media-queries');


// Об'єкт із шляхами до файлів проєкту для легкого доступу та управління
const PATH = {
    scssRootFile: './assets/scss/style.scss',
    scssAllFiles: './assets/scss/**/*.scss',
    scssFolder: './assets/scss/',
    cssFolder: './assets/css/',
    htmlAllFiles: './*.html'
};

// Масив плагінів PostCSS для використання у задачах
const PLUGINS = [
    autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true}),
    sortMQ
];

// Функція для компіляції SCSS у CSS
function compileScss() {
    return src(PATH.scssRootFile)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(PLUGINS))
        .pipe(csscomb())
        .pipe(dest(PATH.cssFolder))
        .pipe(browserSync.stream());
}

// Функція для компіляції та мініфікації SCSS у CSS
function compileScssMin() {
    return src(PATH.scssRootFile)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([...PLUGINS, cssnano({preset: 'default'})]))
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(PATH.cssFolder));
}

// Функція для форматування SCSS файлів за допомогою csscomb
function comb() {
    return src(PATH.scssAllFiles)
        .pipe(csscomb())
        .pipe(dest(PATH.scssFolder));
}

// Функція для ініціалізації BrowserSync
function syncInit() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
}

// Асинхронна функція для оновлення BrowserSync
function sync() {
    browserSync.reload();
    return Promise.resolve();
}

// Функція для спостереження за змінами у файлах
function watchFiles() {
    syncInit();
    watch(PATH.scssAllFiles, series(compileScss, compileScssMin));
    watch(PATH.htmlAllFiles, sync);
}

// Реєстрація задач
task('scss', series(compileScss, compileScssMin));
task('comb', comb);
task('watch', watchFiles);
task('default', series(compileScss, compileScssMin, watchFiles));