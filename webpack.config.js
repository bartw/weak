module.exports = {
    entry: './src/app/app.js',
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw' },
            { test: /\.less$/, loader: "style!css!less" }
        ]
    },
    plugins: []
};