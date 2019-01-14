const mix = require('laravel-mix')
const SpritesmithPlugin = require('webpack-spritesmith')
const fs = require('fs')
const Dotenv = require('dotenv-webpack')
const autoprefixer = require('autoprefixer')

let getFiles = function (dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(`${dir}/${file}`).isFile()
  })
}

/* ============================= Other JS/Css ============================= */

getFiles('resources/assets/js').forEach(function (filepath) {
  mix.js('resources/assets/js/' + filepath, 'public/js')
})

getFiles('resources/assets/sass').forEach(function (filepath) {
  mix.sass('resources/assets/sass/' + filepath, 'public/css')
})

/* ======================================================================== */
/* ============================= Pages JS/Css ============================= */

getFiles('resources/assets/js/pages').forEach(function (filepath) {
  mix.js('resources/assets/js/pages/' + filepath, 'public/js/pages')
})

getFiles('resources/assets/sass/pages').forEach(function (filepath) {
  mix.sass('resources/assets/sass/pages/' + filepath, 'public/css/pages')
})

/* ======================================================================== */

mix.webpackConfig({
  plugins: [
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve('resources/assets/img/sprites'),
        glob: '*.png'
      },
      target: {
        image: path.resolve('public/img/sprite/sprite.png'),
        css: path.resolve('resources/assets/sass/sprite/sprite.sass')
      },
      apiOptions: {
        cssImageRef: '/img/sprite/sprite.png'
      },
      spritesmithOptions: {
        algorithm: 'binary-tree',
        padding: 5
      }

    }),
    new Dotenv()
  ]
})

  .options({
    processCssUrls: false,
    postCss: [
      autoprefixer
    ]
  })
  .copy('resources/assets/img/*.*', './public/img/')
  .version()
  .browserSync(process.env.APP_URL)

if (mix.inProduction()) {
  mix.copyDirectory('resources/assets/js/libs', './public/js/libs')
    .copyDirectory('resources/assets/img/favicon', './public/favicon')
}
