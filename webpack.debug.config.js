var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = require('./webpack.config');

webpackConfig.output = {
    filename: './debug/bundle.js'
};
webpackConfig.devtool = 'inline-source-map';
webpackConfig.plugins.push(new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: './debug/index.html'
}));

module.exports = webpackConfig;