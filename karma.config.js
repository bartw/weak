module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        autoWatchBatchDelay: 300,
        files: ['./src/tests.js'],
        preprocessors: { './src/tests.js': ['webpack', 'sourcemap'] },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ },
                    { test: /\.html$/, loader: 'raw' },
                    { test: /\.less$/, loader: "style!css!less" }
                ]
            }
        },
        webpackMiddleware: { noInfo: true }
    });
};