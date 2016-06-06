module.exports = {
    entry: './src/app/app.js',
    output: {
        filename: './src/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw' }
        ]
    }
};