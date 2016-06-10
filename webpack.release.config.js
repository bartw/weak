var webpackConfig = require('./webpack.config');

webpackConfig.output = {
    filename: './release/bundle.js'
};

module.exports = webpackConfig;