const webpack = require('webpack');
const { rimraf } = require('rimraf');
const { cyan, yellow, red } = require('chalk');
const config = require('./webpack.config.js');

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';
const isCordova = target === 'cordova';

(async () => {
  const ora = (await import('ora')).default;

  const spinner = ora(
    env === 'production'
      ? 'building for production...'
      : 'building development version...'
  );
  spinner.start();

  await rimraf(isCordova ? './cordova/www' : './www/');
  webpack(config, (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.error(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(cyan('  Build complete.\n'));
    console.log(yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ));
    console.error(red('Error message'));
  });
})();