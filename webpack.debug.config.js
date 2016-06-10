var webpackConfig = require('./webpack.config');

webpackConfig.output = {
    filename: './src/bundle.js'
};
webpackConfig.devtool = 'inline-source-map';

module.exports = webpackConfig;