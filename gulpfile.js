const {src, dest, series, parallel, watch} = require(`gulp`),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	sass = require('gulp-dart-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	mode = require('gulp-mode')(),
	browserSync = require('browser-sync').create();

const clean = () => del([`./dist`])

const html = cb => {
	src(`./src/*.html`)
		.pipe(
			fileinclude({
		      prefix: '@',
		      basepath: '@file'
		    })
		)
		.pipe(dest(`./dist`))
		.pipe(browserSync.stream());

	cb();
}

const styles = cb => {
	src(`./src/css/style.sass`)
		.pipe(mode.development(sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(dest(`./dist/css`));

	cb();
}

const transportData = [
	{
		src: `./node_modules/bootstrap/dist/css/bootstrap.min.css`,
		dist: `./dist/css/`
	},
	{
		src: `./node_modules/bootstrap/dist/js/bootstrap.min.js`,
		dist: `./dist/js/`
	}
]

const transport = cb => {
	transportData
		.forEach(item => {
			src(item.src)
				.pipe(dest(item.dist));
		})

	cb();
}

const scripts = cb => {
	src(`./src/js/**/*.js`)
		.pipe(mode.production(uglify()))
		.pipe(dest(`./dist/js`))
		.pipe(browserSync.stream());

	cb();
}

const browser = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    watch(`./src/**/*.html`, html);
    watch(`./src/**/*.js`, scripts);
};


exports.default = series(clean, html, styles, scripts, transport, browser);