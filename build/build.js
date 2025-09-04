const webpack = require('webpack');
const rimraf = require('rimraf');
const chalk = require('chalk');
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

  rimraf(isCordova ? './cordova/www' : './www/', (removeErr) => {
    if (removeErr) throw removeErr;

    webpack(config, (err, stats) => {
      spinner.stop();

      if (err) {
        console.error(chalk.red('Build failed with error:\n'), err);
        process.exit(1);
      }

      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
        }) + '\n\n'
      );

      if (stats.hasErrors()) {
        console.log(chalk.red('Build failed with errors.\n'));
        process.exit(1);
      }

      console.log(chalk.cyan('Build complete.\n'));
    });
  });
})();