var webpackConfig = require('./webpack.debug.config');
webpackConfig.entry = {};
webpackConfig.module.loaders.push({ test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ });

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'],
        files: ['./src/tests.js'],
        preprocessors: { './src/tests.js': ['webpack', 'sourcemap'] },
        webpack: webpackConfig,
        webpackMiddleware: { noInfo: true }
    });
};