var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = require('./webpack.config');

webpackConfig.output = {
    filename: './release/bundle.js'
};
webpackConfig.plugins.push(new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: './release/index.html'
}));

module.exports = webpackConfig;